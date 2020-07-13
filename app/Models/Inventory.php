<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Inventory extends Model
{
    use SoftDeletes;
    protected $table = 'inventories';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'quantity', 'quantity_before', 'quantity_change', 'action', 'type'
    ];

    public function product()
    {
        return $this->belongsTo('App\Models\Product');
    }
    
}
