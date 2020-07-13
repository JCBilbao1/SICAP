<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class DistributorRank extends Model
{
    protected $fillable = [
        'distributor_id', 'rank_id', 'verified'
    ];

    protected $table ='distributor_rank';
}
