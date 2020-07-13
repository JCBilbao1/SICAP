<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AddressType extends Model
{
    protected $fillable= [
        'type'
    ];
    protected $table = 'address_type';
    
    public function address (){
        return $this->hasMany('App\Models\Address');
    }
}
