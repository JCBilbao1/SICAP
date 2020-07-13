<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name','slug', 'description', 'active'
    ];
    protected $table='categories';

    public function products()
    {
        return $this->hasMany('App\Models\Product');
    }
    
}
