<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Distributor;
use App\Http\Requests\UserCreationRequest;
use App\Http\Requests\UserUpdateRequest;
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = User::with('roles')->get();
        
        return response()->json($user);
    
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserCreationRequest $request)
    {
        
        $user = new User;
        $user->first_name = $request['first_name'];
        $user->last_name = $request['last_name'];
        $user->email = $request['email'];
        $user->password = $request['password'];
        $user->save();
        $user->assignRole($request['role_name']);
        return response()->json(['status'=>"Success Creation!"]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::find($id);
        $user->role_name = $user->getRoleNames()->first();
      //  $user['roles'] = $user::roles();
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UserUpdateRequest $request, $id)
    {
        $user = User::find($id);
        $user->first_name = $request['first_name'];
        $user->last_name = $request['last_name'];
        $user->email = $request['email'];
        $user->assignRole($request['role_name']);
        $user->save();
        return response()->json(['status'=>"Success update!"]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function putVerifyDistributor($id,Request $request){
        $distributor = Distributor::find($id);
        $distributor->verified = true;
        $distributor->save();

    }
    public function postCreate(Request $request){
        $user = new User;
        $user->name = $request['name'];
        $user->email = $request['email'];
        $user->password = $request['password'];
        $user->save();
        $user->assignRole('distributor');
        $user_id = $user->id;

        $distributor = new Distributor;
        $distributor->distributor_code = 'SKE'.substr(substr('0000',0,-strlen($user_id)).$user_id .substr(strtotime(date('Y-m-d H:m:s')),0,11),0,15);
        $distributor->verified = 0;
        $distributor->contact_number = $request['contact'];
        $distributor->address = $request['address'];
        $distributor->save();
        $user->distributors()->attach($distributor->id);

        return response()->success(compact('user') );
    }

    public function getMe(Request $request){

        $response =[
            'user'=> auth()->user()
        ];

        $user_id = auth()->user()->id;

        $response['admin'] = false;
        $distributor = new Distributor;
        $distributor = $distributor->whereHas('users', function($q) use ($user_id){
            $q->where('user_id', $user_id);
        })->first();
        if($distributor){
            $response['distributor'] = $distributor;
        }

        $user = User::find($user_id); 
        if($user->hasRole('admin') || $user->hasRole('sales')){
            $response['admin'] = true;
            $response['role'] = $user->getRoleNames()->first();
        }
        return response()->json($response);
    }

    public function deleteTemporary($id){
        $user = User::findorfail($id);
        $user->delete();
        return response()->json(['message'=>'Successfuly Deleted!']);
    }

    public function myOrders(){

        $distributor = auth()->user()->distributors()->first();
        $response =[
            'orders'=> $distributor->orders()->with('order_status')->get()
        ];
        return response()->json($response);
    }
}
