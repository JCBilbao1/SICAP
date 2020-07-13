<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\Product;

class OrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $orders = Order::with(['distributors.users', 'order_details', 'order_status'])->get();
        return $orders;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $checkoutData = $request->checkoutData;
        $new_order = Order::create([
            'total_price' => $checkoutData['total'],
            'distributor_id' => auth()->user()->distributors()->first()->id,
        ]);

        $checkedOut = array();
        $errors = array();
        foreach($checkoutData['products'] as $product) {
            $checkout_srp = $product['srp'];
            $checkout_data = array();
            $quantity = $product['checkoutQty'];
            $checkout_data['quantity'] = $quantity;
            $product = Product::find($product['id']);
            $checkout_data['product'] = $product;
            if ($product->stock_management) {
                if ($product->stock >= $quantity) {
                    $new_stock = $product->stock - $quantity;
                    $product->stock = $new_stock;
                    $product->save();

                    $latest_inventory = $product->latest_inventory()->first();
                    if($latest_inventory) 
                        $quantity_before = $latest_inventory->quantity;
                    else 
                        $quantity_before = 0;

                    $added_inventory = $product->inventory()->create([
                        'quantity' => $new_stock,
                        'quantity_before' => $quantity_before,
                        'quantity_change' => $quantity,
                        'action' => 'checkout',
                        'type' => 'OUT',
                    ]);
                    $checkout_data['inventory'] = $added_inventory;

                    $new_order->order_status()->attach([$new_order->id => 1]);
                } else {
                    if ($product->stock_status == 'reservation') {
                        $new_order->order_status()->attach([$new_order->id => 6]);
                    } else {
                        $errors['not_enough_stock'] = $product->product_name . ' doesn\'t have enough stock';
                        break;
                    }
                }
            } else {
                if ($product->stock_status == 'instock') {
                    $new_order->order_status()->attach([$new_order->id => 1]);
                } else if ($product->stock_status == 'reservation') {
                    $new_order->order_status()->attach([$new_order->id => 6]);
                } else {
                    $errors['not_enough_stock'] = $product->product_name . ' doesn\'t have enough stock';
                    break;
                }
            }

            $new_order->order_details()->create([
                'srp' => $checkout_srp?$checkout_srp:$product->price,
                'discount' => 0,
                'subtotal' => ($checkout_srp?$checkout_srp:$product->price) * $quantity,
                'total' => ($checkout_srp?$checkout_srp:$product->price) * $quantity,
                'quantity' => $quantity,
                'product_id' => $product->id,
            ]);
            
            array_push($checkedOut, $checkout_data);
        }

        if (array_key_exists('not_enough_stock', $errors)) {
            foreach($checkedOut as $data) {
                $quantity = $data['quantity'];
                $product = $data['product'];
                
                if ($product->stock_management) {
                    $new_stock = $product->stock + $quantity;
                    $product->stock = $new_stock;
                    $product->save();
                }

                if(array_key_exists('inventory', $data)) {
                    $inventory = $data['inventory'];
                    $inventory->delete();
                }
            }
            
            $new_order->order_status()->detach();
            $new_order->delete();

            return response()->json([
                'status' => 'Failed',
                'error' => $errors,
            ]);
        }
        
        return response()->json([
            'status' => 'Success',
            'new_order' => $new_order,
        ]);
    }

    public function getDetails($id){
        $order = Order::find($id);
        $order['order_details'] = $order->order_details()->with('product')->get();
        $order['order_status'] = $order->order_status()->first();
        $order['distributors'] = $order->distributors()->with('users')->with(['address'=>function($q){
            $q->with('address_type');
        }])->first();
        return response()->json($order);
    }

    public function postUpdateStatus($id,Request $request){
        $order = Order::find($id);
        $order_status = OrderStatus::where('slug', $request['slug'])->first();
        $result = [];
        $order_attach_status = $order->order_status()->attach($order_status->id);
        $result = $order_status;
        $result['orders']= $order->with('order_details')->get();
        return response()->json($result);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $order = Order::find($id);
        /*
        if($order){
            $order['order_details'] = $order->order_details()->with('product')->get();
            $order['order_status'] = $order->order_status()->orderBy('pivot_created_at', 'DESC')->first();
        }*/
        $order['order_details'] = $order->order_details()->with('product')->get();
        $order['order_status'] = $order->order_status()->first();
        return $order;
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
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
    public function postProductSales(Request $request)
    {
        $order = Order::with(['order_details'=> function($q){
            $q->with('product')->get();
        }])->whereHas('order_status', function($q){
            $q->where('slug','delivered');
        });
        if(isset($request['startDate'])&& !empty($request['startDate'])){
            $order = $order->where('created_at' ,'>=',date('Y-m-d H:m:s',strtotime($request['startDate'])));
        }
    
        if(isset($request['endDate'])&& !empty($request['endDate'])){
            $order = $order->where('created_at','<=',date('Y-m-d H:m:s',strtotime($request['endDate'])));
        }
        
        $order = $order->get();
        return response()->json($order);
    }
}
