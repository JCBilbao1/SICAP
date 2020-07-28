<?php

use Illuminate\Support\Facades\Route;

Route::group(['middleware'=>'api','prefix' => 'auth'], function () {
    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');
    Route::put('me', 'AuthController@putMe');
    Route::post('signup', 'AuthController@signup');
});

//connecting controllers to api
Route::group(['middleware' => 'api'], function($api){
    Route::apiResource('users', 'UserController');
    Route::apiResource('roles', 'RolesController');
    Route::apiResource('projects', 'ProjectController');
    Route::apiResource('project-areas', 'ProjectAreaController');
    Route::apiResource('project-strategies', 'ProjectStrategyController');
    Route::delete('users/delete-temporary/{id}', 'UserController@deleteTemporary');
    Route::delete('projects/delete-temporary/{id}', 'ProjectController@deleteTemporary');
    Route::post('projects/add-file', 'ProjectController@addFile');
    Route::delete('projects/{projectId}/remove-file/{fileId}', 'ProjectController@deleteFile');
});
