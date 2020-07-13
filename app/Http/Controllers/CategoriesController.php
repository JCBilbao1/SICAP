<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Database\QueryException;
class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $category = Category::withCount(['products' => function ($q) {
            $q->where(function($q){
                $q->where(function($q){
                    $q->where('stock_management', 0);
                    $q->where(function($q){
                        $q->where('stock_status', 'instock');
                        $q->orWhere('stock_status', 'reservation');
                    });
                });
                $q->orWhere(function($q){
                    $q->where('stock_management', 1);
                    $q->where(function($q){
                        $q->where('stock_status', 'reservation');
                        $q->orWhere('stock', '>', 0);
                    });
                });
            });
        }])->get();
        return response()->json($category);
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $category_data = $request->all();

        $for_validation = [
            'name' => 'required',
        ];

        if (!empty(trim($category_data['name'])) && empty(trim($category_data['slug']))) {
            $category_data['slug'] = strtolower(Str::slug($category_data['name'], '-'));
            $for_validation['slug'] = 'unique:categories';
        } else {
            $category_data['slug'] = strtolower($category_data['slug']);
            $for_validation['slug'] = 'required|unique:categories|alpha_dash';
        }
        $request->merge($category_data);

        $request->validate($for_validation);

        $number=1;
        $slug = $category_data['slug'];
        do {
            try {
                $new_category = Category::create([
                    'name' => $category_data['name'],
                    'slug' => $category_data['slug'],
                    'description' => $category_data['description'],
                ]);
                $created = true;
            } catch ( QueryException $e ) {
                $errorCode = $e->errorInfo[1];
                if($errorCode == 1062){
                    $created = false;
                    $category_data['slug'] = $slug . '-' . $number;
                    $number++;
                }
            }
        } while ( !$created );
        
        return response()->json([
            'status' => 'Success',
            'new_category' => $new_category,
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
        $category = Category::where('slug', $slug)->first();
        return response()->json($category);

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
        $category_data = $request->all();
        $old_category_data = Category::where('slug', $slug)->first();

        $for_validation = [
            'name' => 'required',
        ];

        if((trim($category_data['slug']) == $old_category_data->slug 
            && trim($category_data['name']) != $old_category_data->slug)
            || (!empty(trim($category_data['name'])) && empty(trim($category_data['slug'])))) {
            $category_data['slug'] = strtolower(Str::slug($category_data['name'], '-'));
        } else {
            $category_data['slug'] = strtolower($category_data['slug']);
            $for_validation['slug'] = 'required|unique:categories|alpha_dash';
        }
        $request->merge($category_data);

        $request->validate($for_validation);

        $number=1;
        $slug = $category_data['slug'];
        do {
            try {
                $category = $old_category_data->update([
                    'name' => $category_data['name'],
                    'description' => $category_data['description'],
                    'slug' => $category_data['slug'],
                ]);
                $created = true;
            } catch ( QueryException $e ) {
                $errorCode = $e->errorInfo[1];
                if($errorCode == 1062){
                    $created = false;
                    $category_data['slug'] = $slug . '-' . $number;
                    $number++;
                }
            }
        } while ( !$created );
        
        return response()->json($category_data);
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
        $category = Category::find($id);
        $category->delete();
        return response()->json(['message'=>'Successfuly Deleted!']);
    }
    public function putchangeStatus(Request $request,$id){
        $category = Category::find($id);
        $category->active = $request['active'];
        $category->save();
        return response()->json($category);
    }
}
