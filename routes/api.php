<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});   
Route::group(['middleware'=>'api','prefix' => 'auth'], function ($router) {
    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');
    Route::put('me', 'AuthController@putMe');
    Route::post('signup','AuthController@signup');
});

//connecting controllers to api
Route::group(['middleware' => 'api'], function($api){
    Route::apiResource('users', 'UserController');
    Route::apiResource('distributors', 'DistributorsController');
    Route::apiResource('products', 'ProductsController');
    Route::apiResource('orders', 'OrdersController');
    Route::apiResource('categories', 'CategoriesController');
    Route::apiResource('rewards', 'RewardsController');
    Route::apiResource('roles', 'RolesController');
    Route::apiResource('payments', 'PaymentsController');
    Route::post('points/add/{distributor_id}', 'PointsController@postAdd');
    Route::post('users/me', 'UserController@getMe');
    Route::post('users/orders', 'UserController@myOrders');
    Route::post('products/price-promo/{id}', 'ProductsController@postPricePromo');
    Route::get('distributor/unverified', 'DistributorsController@getUnverified');
    Route::put('distributor/update', 'DistributorsController@putUpdate');
    Route::delete('distributor/delete-temporary/{id}', 'DistributorsController@deleteTemporary');
    Route::delete('products/delete-temporary/{id}', 'ProductsController@deleteTemporary');
    Route::delete('users/delete-temporary/{id}', 'UserController@deleteTemporary');
    Route::delete('categories/delete-temporary/{id}', 'CategoriesController@deleteTemporary');
    Route::delete('rewards/delete-temporary/{id}', 'RewardsController@deleteTemporary');
    Route::post('order/product-sales/','OrdersController@postProductSales');
    Route::get('orders/details/{id}', 'OrdersController@getDetails');
    Route::post('orders/update-status/{id}', 'OrdersController@postUpdateStatus');
    Route::post('products/featured', 'ProductsController@getFeaturedProducts');
    Route::put('categories/change-status/{id}', 'CategoriesController@putchangeStatus');
    Route::put('rewards/change-status/{id}', 'RewardsController@putchangeStatus');
    Route::get('products/shop-product-details/{slug}', 'ProductsController@getShopProductDetails');
    Route::get('skm-rewards', 'RewardsController@skmRewards');
    Route::get('rewards/skm-reward-details/{slug}', 'RewardsController@skmRewardDetails');
    Route::delete('payments/delete-temporary/{id}', 'PaymentsController@deleteTemporary');
    Route::put('payments/change-status/{id}', 'PaymentsController@putchangeStatus');
    Route::post('payments/checkout', 'PaymentsController@getPaymentMethodsCheckOut');
});
