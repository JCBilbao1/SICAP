<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Distributor extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'distributor_code', 'verified', 'contact_number','address','facebook','instagram','facebook_name','instagram_name','referral_code'
    ];
    
    public function users(){
        return $this->belongsToMany('App\Models\User','user_distributor');
    }
    
    public function ranks(){
        return $this->belongsToMany('App\Models\Rank','distributor_rank')->latest('pivot_created_at')->withPivot('verified','area')->withTimeStamps();
    }
    public function address(){
        return $this->belongsToMany('App\Models\Address','distributor_address')->withTimeStamps();
    }

    public function orders(){
        return $this->hasMany('App\Models\Order');
    }

    public function points(){
        return $this->hasMany('App\Models\Point')->latest();
    }
}
