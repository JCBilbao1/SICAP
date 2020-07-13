<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Order extends Model
{
    protected $table = 'orders';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'total_price', 'distributor_id',
    ];

    public function order_details()
    {
        return $this->hasMany('App\Models\OrderDetail');
    }
    
    public function order_status()
    {
        return $this->belongsToMany('App\Models\OrderStatus', 'order_status_history', 'order_id', 'order_status_id')->latest('pivot_created_at')->withTimeStamps();
    }

    public function distributors()
    {
        return $this->belongsTo('App\Models\Distributor', 'distributor_id');
    }
}
