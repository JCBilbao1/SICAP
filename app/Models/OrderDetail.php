<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class OrderDetail extends Model
{
    protected $table = 'order_details';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'srp', 'discount', 'subtotal', 'total', 'quantity', 'product_id',
    ];

    public function product()
    {
        return $this->belongsTo('App\Models\Product');
    }
}
