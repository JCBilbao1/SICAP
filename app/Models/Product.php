<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Product extends Model
{
    use SoftDeletes;
    protected $table = 'products';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'product_name', 'description', 'slug', 'price', 'points', 'category_id', 'stock_management', 'stock_status', 'stock'
    ];

    public function category()
    {
        return $this->belongsTo('App\Models\Category');
    }

    public function inventory()
    {
        return $this->belongsToMany('App\Models\Inventory', 'product_inventory')->withTimeStamps();
    }

    public function latest_inventory()
    {
        return $this->belongsToMany('App\Models\Inventory', 'product_inventory')->withTimeStamps()->latest();
    }

    public function images()
    {
        return $this->belongsToMany('App\Models\File', 'product_file')->orderBy('pivot_order', 'ASC')->withPivot(['order']);
    }
    
    public function rank()
    {
        return $this->belongsToMany('App\Models\Rank', 'product_rank')->withPivot('price','points')->withTimeStamps();
    }
}
