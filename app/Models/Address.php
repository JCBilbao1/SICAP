<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'address_line1','address_line2','city','state','country','zip_code', 'address_type_id'
    ];
    protected $table='address';

    
    public function address_type(){
        return $this->belongsTo('App\Models\AddressType','address_type_id');
    }
}

