<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Reward extends Model
{
    use SoftDeletes;
    protected $table = 'rewards';

    protected $fillable = [
        'name','price','slug', 'description', 'active'
    ];

    public function images()
    {
        return $this->belongsToMany('App\Models\File', 'reward_file')->orderBy('pivot_order', 'ASC')->withPivot(['order']);
    }
}
