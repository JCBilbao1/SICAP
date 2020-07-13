<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductRank;
use App\Models\Rank;
use App\Models\Category;
use App\Models\File;
use Illuminate\Support\Str;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::whereNull('deleted_at')->with('rank');

        if(request()->input('category_filter') != null && !empty(trim(request()->input('category_filter')))) {
            $category = Category::where('slug', request()->input('category_filter'))->first();
            $products = $category->products();
        }

        if(request()->has('per_page') && request()->has('page')) {
            $products = $products->where(function($q){
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

            $total_products = $products->count();

            $products = $products->skip((request()->input('page') - 1) * request()->input('per_page'))
                ->take(request()->input('per_page'));

            $products = $products->with('images','rank');

            $products = $products->get();

            $products = $products->map(function($product){
                $product->images = $product->images->map(function($image){
                    $image['url'] = url(Storage::url($image->directory . $image->file_name));
                    return $image;
                });
                return $product;
            });

            if(request()->input('sorting_filter') != null && !empty(trim(request()->input('sorting_filter')))) {
                if(request()->input('sorting_filter') == 'latest') {
                    $products = $products->sortBy('created_at');
                } else if(request()->input('sorting_filter') == 'low_to_high') {
                    $products = $products->sortBy('price');
                } else if(request()->input('sorting_filter') == 'high_to_low') {
                    $products = $products->sortByDesc('price');
                }
            }

            if(isset($category))
                $category = $category->name;
            else 
                $category = null;

            return ['products'=>$products->values()->all(),'total_products'=>$total_products, 'category'=>$category];
        }

        $products = $products->get();
        return $products;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $product_data = $request->all();

        $for_validation = [
            'product_name' => 'required',
            'description' => '',
            'category_id' => 'required',
            'price' => 'required',
            'points' => 'required',
        ];

        if (!empty(trim($product_data['product_name'])) && empty(trim($product_data['slug']))) {
            $product_data['slug'] = strtolower(Str::slug($product_data['product_name'], '-'));
        } else {
            $product_data['slug'] = strtolower($product_data['slug']);
            $for_validation['slug'] = 'required|unique:products|alpha_dash';
        }
        $request->merge($product_data);

        $request->validate($for_validation);

        $number=1;
        $slug = $product_data['slug'];

        if($product_data['stock_management'] && $product_data['accept_reservation'])
            $product_data['stock_status'] = 'reservation';
        else if($product_data['stock_management'])
            $product_data['stock_status'] = 'outofstock';
        else {
            $product_data['stock'] = 0;
            $product_data['stock_status'] = $product_data['stock_status'];
        }
        
        $new_product = null;
        $created = false;
        do {
            try {
                $new_product = Product::create($product_data);
                $created = true;
            } catch ( QueryException $e ) {
                $errorCode = $e->errorInfo[1];
                if($errorCode == 1062){
                    $created = false;
                    $product_data['slug'] = $slug . '-' . $number;
                    $number++;
                }
            }
        } while ( !$created );

        if($product_data['stock_management']) {
            $new_product->inventory()->create([
                'quantity' => $product_data['stock'],
                'quantity_before' => 0,
                'quantity_change' => $product_data['stock'],
                'action' => 'create',
                'type' => 'IN',
            ]);
        }

        if(count($product_data['base64Images']) > 0){
            ini_set('max_execution_time', 180);
            $date_num = ((int) date("Ymdhis")) - 1;
            foreach($product_data['base64Images'] as $index => $imageData) {
                if (isset($imageData['cropped']) && preg_match('/^data:image\/(\w+);base64,/', $imageData['base64'])) {
                    $image_64 = $imageData['base64'];
    
                    $extension = explode('/', explode(':', substr($image_64, 0, strpos($image_64, ';')))[1])[1];   // .jpg .png .pdf
    
                    $replace = substr($image_64, 0, strpos($image_64, ',')+1); 
    
                    // find substring fro replace here eg: data:image/png;base64,
    
                    $image = str_replace($replace, '', $image_64); 
    
                    $image = str_replace(' ', '+', $image);

                    $image_directory = 'products/' . $new_product->slug . '/';

                    $image_id = null;

                    do {
                        $date_num++;
                        $image_name = $date_num.'.'.$extension;
                    } while ( Storage::disk('public')->exists($image_directory . $image_name) );

                    Storage::disk('public')->put($image_directory . $image_name, base64_decode($image));

                    $image_id = $new_product->images()->create([
                        'file_name' => $image_name,
                        'directory' => $image_directory,
                        'file_type' => $extension,
                    ])->id;

                    $new_product->images()->updateExistingPivot($image_id, [
                        'order' => $index,
                    ]);
                }
            }
        }
        
        return response()->json([
            'status' => 'Success',
            'new_product' => $new_product,
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
        $product = Product::where('slug', $slug)->with('category', 'latest_inventory','rank', 'images')->first();
        $product->images = $product->images->map(function($image){
            $image['base64'] = 'data:image/jpg;base64,' . base64_encode(Storage::disk('public')->get($image->directory . $image->file_name));
            return $image;
        });
        return $product;
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
        $product_data = $request->all();
        $old_product_data = Product::where('slug', $slug)->first();

        if(count($product_data['base64Images']) > 0){
            ini_set('max_execution_time', 180);
            $date_num = ((int) date("Ymdhis")) - 1;
            foreach($product_data['base64Images'] as $index => $imageData) {
                if (isset($imageData['cropped']) && preg_match('/^data:image\/(\w+);base64,/', $imageData['base64'])) {
                    $image_64 = $imageData['base64'];
    
                    $extension = explode('/', explode(':', substr($image_64, 0, strpos($image_64, ';')))[1])[1];   // .jpg .png .pdf
    
                    $replace = substr($image_64, 0, strpos($image_64, ',')+1); 
    
                    // find substring fro replace here eg: data:image/png;base64,
    
                    $image = str_replace($replace, '', $image_64); 
    
                    $image = str_replace(' ', '+', $image);

                    $image_directory = 'products/' . $old_product_data->slug . '/';

                    $image_id = null;
                    if(isset($imageData['id']) && !empty($old_product_data->images()->find($imageData['id']))) {
                        $image_id = $imageData['id'];
                        $image_name = $imageData['file_name'];
                        Storage::disk('public')->put($image_directory . $image_name, base64_decode($image));
                    } else {
                        do {
                            $date_num++;
                            $image_name = $date_num.'.'.$extension;
                        } while ( Storage::disk('public')->exists($image_directory . $image_name) );

                        Storage::disk('public')->put($image_directory . $image_name, base64_decode($image));

                        $image_id = $old_product_data->images()->create([
                            'file_name' => $image_name,
                            'directory' => $image_directory,
                            'file_type' => $extension,
                        ])->id;
                        $product_data['base64Images'][$index]['id'] = $image_id;
                    }

                    $old_product_data->images()->updateExistingPivot($image_id, [
                        'order' => $index,
                    ]);
                } else {
                    $image_id = $imageData['id'];
                    
                    $old_product_data->images()->updateExistingPivot($image_id, [
                        'order' => $index,
                    ]);
                }
            }

            $image_ids = collect($product_data['base64Images'])->pluck('id')->toArray();
            $images_to_delete = $old_product_data->images()->whereNotIn('files.id', $image_ids)->get();
            foreach($images_to_delete as $image) {
                Storage::disk('public')->delete($image->directory . $image->file_name);
                $old_product_data->images()->detach($image->id);
                File::find($image->id)->delete();
            }
        } else {
            foreach($old_product_data->images as $image) {
                Storage::disk('public')->delete($image->directory . $image->file_name);
                $old_product_data->images()->detach($image->id);
                File::find($image->id)->delete();
            }
        }

        $for_validation = [
            'product_name' => 'required',
            'description' => '',
            'category' => 'required',
            'price' => 'required',
            'points' => 'required',
        ];

        if((trim($product_data['slug']) == $old_product_data->slug 
            && trim($product_data['product_name']) != $old_product_data->slug)
            || (!empty(trim($product_data['product_name'])) && empty(trim($product_data['slug'])))) {
            $product_data['slug'] = strtolower(Str::slug($product_data['product_name'], '-'));
        } else {
            $product_data['slug'] = strtolower($product_data['slug']);
            $for_validation['slug'] = 'required|unique:products|alpha_dash';
        }
        $request->merge($product_data);

        $request->validate($for_validation);

        $number=1;
        $slug = $product_data['slug'];

        $update_data = [
            'product_name' => $product_data['product_name'],
            'description' => $product_data['description'],
            'slug' => $product_data['slug'],
            'price' => $product_data['price'],
            'points' => $product_data['points'],
            'category_id' => (int)$product_data['category'],
            'stock_management' => $product_data['stock_management'],
        ];
        if($product_data['stock_management'] && $product_data['accept_reservation'])
            $update_data['stock_status'] = 'reservation';
        else if($product_data['stock_management'])
            $update_data['stock_status'] = 'outofstock';
        else
            $update_data['stock_status'] = $product_data['stock_status'];
        
        if($product_data['stock_management'] && $product_data['stock_action'] != '') {
            $latest_inventory = $old_product_data->latest_inventory()->first();
            if($latest_inventory) 
                $quantity_before = $latest_inventory->quantity;
            else 
                $quantity_before = 0;
            
            if($product_data['stock_action'] == 'add_stock'){
                $quantity = (int) $quantity_before + (int) $product_data['quantity_change'];
                $type = 'IN';
            } else {
                $quantity = (int) $quantity_before - (int) $product_data['quantity_change'];
                $type = 'OUT';
            }

            $old_product_data->inventory()->create([
                'quantity' => $quantity,
                'quantity_before' => $quantity_before,
                'quantity_change' => $product_data['quantity_change'],
                'action' => 'update',
                'type' => $type,
            ]);

            $update_data['stock'] = $quantity;
        } else {
            $update_data['stock'] = ($old_product_data->latest_inventory()->count() > 0) ? $old_product_data->latest_inventory()->first()->quantity : 0;
        }

        $updated = false;
        do {
            try {
                $product = $old_product_data->update($update_data);
                $updated = true;
            } catch ( QueryException $e ) {
                $errorCode = $e->errorInfo[1];
                if($errorCode == 1062){
                    $updated = false;
                    $product_data['slug'] = $slug . '-' . $number;
                    $number++;
                }
            }
        } while ( !$updated );
        
        return response()->json([
            'status' => 'Success',
            'product_slug' => $product_data['slug'],
        ]);
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
    public function postPricePromo($id,Request $request){

        $product_data = Product::find($id);
        foreach($request['data'] as $key=>$value){
            $rank_slug = $value['rank'];
            $rank = Rank::where('slug', $rank_slug)->get();
            if(count($rank) > 0){
                $product_rank_check = ProductRank::where('product_id',$id)->where('rank_id', $rank[0]->id)->get();
                if(count($product_rank_check) > 0){
                    $product_rank_check = ProductRank::find($product_rank_check[0]->id);
                    $product_rank_check->points = $value['points']?$value['points']:$product_data->points;
                    $product_rank_check->price = $value['price']?$value['price']:$product_data->price;
                    $product_rank_check->save();
                } else {
                    $product_rank_creation = new ProductRank;
                    $product_rank_creation->product_id = $product_data->id;
                    $product_rank_creation->rank_id = $rank[0]->id;
                    $product_rank_creation->points = $value['points']?$value['points']:$product_data->points;
                    $product_rank_creation->price = $value['price']?$value['price']:$product_data->price;
                    $product_rank_creation->save();
                }
            }
        }
        return response()->json(['message'=>"Successfuly updated product's price and points by rank"]);
    }
    public function deleteTemporary($id){
        $product = Product::findorfail($id);
        $product->delete();
        return response()->json(['message'=>'Successfuly Deleted!']);
    }

    public function getShopProductDetails($slug)
    {
        $product = Product::where('slug', $slug)->with('category', 'latest_inventory','rank', 'images')->first();
        $product->images = $product->images->map(function($image){
            $image['url'] = url(Storage::url($image->directory . $image->file_name));
            return $image;
        });
        return $product;
    }

    public function getFeaturedProducts() {
        $products = Product::whereNull('deleted_at');
        $products = $products->with('rank');

        $products = $products->take(20);

        $products = $products->where(function($q){
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

        $products = $products->with('images','rank');

        $products = $products->get();

        $products = $products->map(function($product){
            $product->images = $product->images->map(function($image){
                $image['url'] = url(Storage::url($image->directory . $image->file_name));
                return $image;
            });
            return $product;
        });

        return $products->values()->all();
    }
}
