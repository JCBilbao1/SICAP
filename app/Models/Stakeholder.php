<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stakeholder extends Model
{
    protected $table = 'project_stakeholders';
    public $timestamps = false;
    
    protected $fillable = [
        'project_id', 'stakeholder', 'stakeholder_type',
    ];
    
    public function field_data()
    {
        return $this->hasMany('App\Models\StakeholderData', 'project_stakeholder_id');
    }
}
