<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectStrategy extends Model
{
    protected $table = 'project_strategies';
    
    protected $fillable = [
        'name',
    ];
    
}
