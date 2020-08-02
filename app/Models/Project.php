<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $table = 'projects';
    
    protected $fillable = [
        'project_area', 'project_strategy', 'place', 'theme', 'date', 'status',
    ];

    public function stakeholders()
    {
        return $this->hasMany('App\Models\Stakeholder');
    }

    public function jru_stakeholders()
    {
        return $this->hasMany('App\Models\Stakeholder')->where('stakeholder', 'JRU');
    }

    public function community_stakeholders()
    {
        return $this->hasMany('App\Models\Stakeholder')->where('stakeholder', 'Community');
    }

    public function other_stakeholders()
    {
        return $this->hasMany('App\Models\Stakeholder')->where('stakeholder', 'Other');
    }

    public function files()
    {
        return $this->belongsToMany('App\Models\File' , 'project_file')->withTimeStamps()->latest();
    }

    public function evaluation_files()
    {
        return $this->belongsToMany('App\Models\File' , 'project_file')->wherePivot('type', 'evaluation')->withTimeStamps()->latest();
    }

    public function report_files()
    {
        return $this->belongsToMany('App\Models\File', 'project_file')->wherePivot('type', 'report')->withTimeStamps()->latest();
    }
    
}
