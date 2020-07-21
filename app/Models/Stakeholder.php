<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stakeholder extends Model
{
    protected $table = 'project_stakeholders';
    
    protected $fillable = [
        'stakeholder', 'stakeholder_type', 'stakeholder_field', 'stakeholder_field_value',
    ];
    
}
