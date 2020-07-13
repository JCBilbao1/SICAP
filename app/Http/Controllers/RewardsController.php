<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reward;
use Illuminate\Support\Str;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;

class RewardsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $reward = Reward::all();
        return response()->json($reward);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $reward_data = $request->all();

        $for_validation = [
            'name' => 'required',
            'price'=> 'required',
        ];

        if (!empty(trim($reward_data['name'])) && empty(trim($reward_data['slug']))) {
            $reward_data['slug'] = strtolower(Str::slug($reward_data['name'], '-'));
            $for_validation['slug'] = 'unique:rewards';
        } else {
            $reward_data['slug'] = strtolower($reward_data['slug']);
            $for_validation['slug'] = 'required|unique:rewards|alpha_dash';
        }
        $request->merge($reward_data);

        $request->validate($for_validation);

        $number=1;
        $slug = $reward_data['slug'];
        $new_reward = null;
        $created = false;

        do {
            try {
                $new_reward = Reward::create([
                    'name' => $reward_data['name'],
                    'price' => $reward_data['price'],
                    'slug' => $reward_data['slug'],
                    'description' => $reward_data['description'],
                ]);
                $created = true;
            } catch ( QueryException $e ) {
                $errorCode = $e->errorInfo[1];
                if($errorCode == 1062){
                    $created = false;
                    $reward_data['slug'] = $slug . '-' . $number;
                    $number++;
                }
            }
        } while ( !$created );

        if(count($reward_data['base64Images']) > 0){
            ini_set('max_execution_time', 180);
            $date_num = ((int) date("Ymdhis")) - 1;
            foreach($reward_data['base64Images'] as $index => $imageData) {
                if (isset($imageData['cropped']) && preg_match('/^data:image\/(\w+);base64,/', $imageData['base64'])) {
                    $image_64 = $imageData['base64'];
    
                    $extension = explode('/', explode(':', substr($image_64, 0, strpos($image_64, ';')))[1])[1];   // .jpg .png .pdf
    
                    $replace = substr($image_64, 0, strpos($image_64, ',')+1); 
    
                    // find substring fro replace here eg: data:image/png;base64,
    
                    $image = str_replace($replace, '', $image_64); 
    
                    $image = str_replace(' ', '+', $image);

                    $image_directory = 'rewards/' . $new_reward->slug . '/';

                    $image_id = null;

                    do {
                        $date_num++;
                        $image_name = $date_num.'.'.$extension;
                    } while ( Storage::disk('public')->exists($image_directory . $image_name) );

                    Storage::disk('public')->put($image_directory . $image_name, base64_decode($image));

                    $image_id = $new_reward->images()->create([
                        'file_name' => $image_name,
                        'directory' => $image_directory,
                        'file_type' => $extension,
                    ])->id;

                    $new_reward->images()->updateExistingPivot($image_id, [
                        'order' => $index,
                    ]);
                }
            }
        }
        
        return response()->json([
            'status' => 'Success',
            'new_reward' => $new_reward,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        $reward = Reward::where('slug', $slug)->with('images')->first();
        $reward->images = $reward->images->map(function($image){
            $image['base64'] = 'data:image/jpg;base64,' . base64_encode(Storage::disk('public')->get($image->directory . $image->file_name));
            return $image;
        });
        return response()->json($reward);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $slug)
    {
       
        $reward_data = $request->all();
        $old_reward_data = Reward::where('slug', $slug)->first();

        if(count($reward_data['base64Images']) > 0){
            ini_set('max_execution_time', 180);
            $date_num = ((int) date("Ymdhis")) - 1;
            foreach($reward_data['base64Images'] as $index => $imageData) {
                if (isset($imageData['cropped']) && preg_match('/^data:image\/(\w+);base64,/', $imageData['base64'])) {
                    $image_64 = $imageData['base64'];
    
                    $extension = explode('/', explode(':', substr($image_64, 0, strpos($image_64, ';')))[1])[1];   // .jpg .png .pdf
    
                    $replace = substr($image_64, 0, strpos($image_64, ',')+1); 
    
                    // find substring fro replace here eg: data:image/png;base64,
    
                    $image = str_replace($replace, '', $image_64); 
    
                    $image = str_replace(' ', '+', $image);

                    $image_directory = 'rewards/' . $old_reward_data->slug . '/';

                    $image_id = null;
                    if(isset($imageData['id']) && !empty($old_reward_data->images()->find($imageData['id']))) {
                        $image_id = $imageData['id'];
                        $image_name = $imageData['file_name'];
                        Storage::disk('public')->put($image_directory . $image_name, base64_decode($image));
                    } else {
                        do {
                            $date_num++;
                            $image_name = $date_num.'.'.$extension;
                        } while ( Storage::disk('public')->exists($image_directory . $image_name) );

                        Storage::disk('public')->put($image_directory . $image_name, base64_decode($image));

                        $image_id = $old_reward_data->images()->create([
                            'file_name' => $image_name,
                            'directory' => $image_directory,
                            'file_type' => $extension,
                        ])->id;
                        $reward_data['base64Images'][$index]['id'] = $image_id;
                    }

                    $old_reward_data->images()->updateExistingPivot($image_id, [
                        'order' => $index,
                    ]);
                } else {
                    $image_id = $imageData['id'];
                    
                    $old_reward_data->images()->updateExistingPivot($image_id, [
                        'order' => $index,
                    ]);
                }
            }

            $image_ids = collect($reward_data['base64Images'])->pluck('id')->toArray();
            $images_to_delete = $old_reward_data->images()->whereNotIn('files.id', $image_ids)->get();
            foreach($images_to_delete as $image) {
                Storage::disk('public')->delete($image->directory . $image->file_name);
                $old_reward_data->images()->detach($image->id);
                File::find($image->id)->delete();
            }
        } else {
            foreach($old_reward_data->images as $image) {
                Storage::disk('public')->delete($image->directory . $image->file_name);
                $old_reward_data->images()->detach($image->id);
                File::find($image->id)->delete();
            }
        }

        $for_validation = [
            'name' => 'required',
            'price'=> 'required',
        ];

        if((trim($reward_data['slug']) == $old_reward_data->slug 
            && trim($reward_data['name']) != $old_reward_data->slug)
            || (!empty(trim($reward_data['name'])) && empty(trim($reward_data['slug'])))) {
            $reward_data['slug'] = strtolower(Str::slug($reward_data['name'], '-'));
        } else {
            $reward_data['slug'] = strtolower($reward_data['slug']);
            $for_validation['slug'] = 'required|unique:rewards|alpha_dash';
        }
        $request->merge($reward_data);

        $request->validate($for_validation);

        $number=1;
        $slug = $reward_data['slug'];
        $updated = false;
        do {
            try {
                $reward = $old_reward_data->update([
                    'name' => $reward_data['name'],
                    'price' => $reward_data['price'],
                    'description' => $reward_data['description'],
                    'slug' => $reward_data['slug'],
                ]);
                $updated = true;
            } catch ( QueryException $e ) {
                $errorCode = $e->errorInfo[1];
                if($errorCode == 1062){
                    $created = false;
                    $reward_data['slug'] = $slug . '-' . $number;
                    $number++;
                }
            }
        } while ( !$updated );
        
        return response()->json($reward_data);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function deleteTemporary($id){
        $reward = Reward::find($id);
        $reward->delete();
        return response()->json(['message'=>'Successfuly Deleted!']);
    }
    public function putchangeStatus(Request $request,$id){
        $reward = Reward::find($id);
        $reward->active = $request['active'];
        $reward->save();
        return response()->json($reward);
    }

    public function skmRewards() {
        $rewards = Reward::whereNull('deleted_at');

        if(request()->has('per_page') && request()->has('page')) {
            $rewards = $rewards->where('active', 1);

            $total_rewards = $rewards->count();

            $rewards = $rewards->skip((request()->input('page') - 1) * request()->input('per_page'))
                ->take(request()->input('per_page'));

            $rewards = $rewards->with('images');

            $rewards = $rewards->get();

            $rewards = $rewards->map(function($reward){
                $reward->images = $reward->images->map(function($image){
                    $image['url'] = url(Storage::url($image->directory . $image->file_name));
                    return $image;
                });
                return $reward;
            });

            if(request()->input('sorting_filter') != null && !empty(trim(request()->input('sorting_filter')))) {
                if(request()->input('sorting_filter') == 'latest') {
                    $rewards = $rewards->sortBy('created_at');
                } else if(request()->input('sorting_filter') == 'low_to_high') {
                    $rewards = $rewards->sortBy('price');
                } else if(request()->input('sorting_filter') == 'high_to_low') {
                    $rewards = $rewards->sortByDesc('price');
                }
            }
            
            return ['rewards'=>$rewards->values()->all(),'total_rewards'=>$total_rewards];
        }

        $rewards = $rewards->get();
        return $rewards;
    }

    public function skmRewardDetails($slug)
    {
        $reward = reward::where('slug', $slug)->with('images')->first();
        $reward->images = $reward->images->map(function($image){
            $image['url'] = url(Storage::url($image->directory . $image->file_name));
            return $image;
        });
        return $reward;
    }
}
