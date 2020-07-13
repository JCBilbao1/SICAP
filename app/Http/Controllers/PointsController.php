<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Distributor;
use App\Models\Point;
use App\Models\Product;

class PointsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
    public function postAdd($distributor_id, Request $request){
        $distributor = Distributor::find($distributor_id);
        if(empty($distributor)){
            return response()->json(['error'=>true,'message'=>'distributor_id is not recognized']);
        }
        $distributor_rank = $distributor->ranks()->latest()->first();
        
        $orders = $request['orders'];
        $total_points = 0;
        $order_number = '';
        foreach($orders as $order){
            if(end($orders) == $order){
                $order_number .= $order['id'];
            } else {
                $order_number .= $order['id'] . ', ';
            }
            foreach($order['order_details'] as $order_detail){
                $product = Product::find($order_detail['product_id']);
                $product_rank = $product->rank()->where('rank_id', $distributor_rank['id'])->first();
                if(!empty($product_rank)){
                    $total_points += ($product_rank['pivot']['points'] * $order_detail['quantity']);
                } else {
                    $total_points += ($product['points'] * $order_detail['quantity']);
                }
            }
        }
        $points_latest = $distributor->points()->latest()->first();

        if(empty($points_latest)){
            $result['action'] = 'create new';
            $points = new Point;
            $points->points = $total_points;
            $points->points_before = 0;
            $points->points_change = $total_points;
            $points->action = 'create';
            $points->type = 'IN';
            $points->description = 'ORDER# '. $order_number;
            $points->distributor_id = $distributor_id;
            $points->save();
            $result['points'] = $points;
        } else {
            $result['action'] = 'update old';
            $points = new Point;
            $points->points = $total_points + $points_latest->points;
            $points->points_before =  $points_latest->points;
            $points->points_change = $total_points;
            $points->action = 'order';
            $points->type = 'IN';
            $points->description = 'ORDER# '. $order_number;
            $points->distributor_id = $distributor_id;
            $points->save();
            $result['points'] = $points;
        }
        return response()->json($result);

    }
}
