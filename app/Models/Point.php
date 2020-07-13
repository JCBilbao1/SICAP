<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Point extends Model
{
    //
    protected $fillable = [
        'points', 'points_before', 'points_change', 'action', 'type', 'distributor_id','description'
    ];

    protected $table = 'points';

    public function distributors()
    {
        return $this->belongsTo('App\Models\Distributor', 'distributor_id');
    }
}
