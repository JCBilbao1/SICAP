<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectArea extends Model
{
    protected $table = 'project_areas';
    
    protected $fillable = [
        'name',
    ];
    
}
