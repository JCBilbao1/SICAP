<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $table = 'projects';
    
    protected $fillable = [
        'project_area', 'project_strategy', 'place', 'theme', 'date',
    ];

    public function stakeholders()
    {
        return $this->hasMany('App\Models\Stakeholder');
    }
    
}
