<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductRank extends Model
{
    protected $table = 'product_rank';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'product_id','rank_id','points','price'
    ];

}

