<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DistributorAddress extends Model
{
    protected $table= 'distributor_address';
    protected $fillable = [
        'distributor_id', 'address_id'
    ];
    
}
