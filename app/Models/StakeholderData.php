<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StakeholderData extends Model
{
    protected $table = 'project_stakeholders_data';
    public $timestamps = false;
    
    protected $fillable = [
        'project_stakeholder_id', 'stakeholder_field', 'stakeholder_field_value',
    ];
    
}
