<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rank extends Model
{
    protected $fillable = [
        'title', 'slug', 'active','description'
    ];
    protected $table= 'ranks';
}
