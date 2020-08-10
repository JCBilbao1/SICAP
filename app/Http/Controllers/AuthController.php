<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\SignUpRequest;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login','signup']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Email or password does not exist'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        $user = auth()->user();
        $user->role_name = $user->role;

        // if(Storage::disk('public')->exists($user->image))
        //     $user->image = 'data:image/jpg;base64,' . base64_encode(Storage::disk('public')->get($user->image));

        $response =[
            'user'=> $user
        ];
        
        return response()->json($response);
    }

    public function putMe(Request $request)
    {
        $rules = [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required',
        ];
    
        $this->validate($request, $rules);

        $user = auth()->user();

        $data_to_update = [
            'first_name' => $request['first_name'],
            'last_name' => $request['last_name'],
            'email' => $request['email'],
        ];

        $user->update($data_to_update);

        $response =[
            'status' => 'Account Updated!',
            'user'=> $user,
        ];
        
        return response()->json($response);
    }

    public function changePassword(Request $request)
    {
        $rules = [
            'current_password' => 'required|password',
            'password' => 'required|confirmed',
        ];
    
        $this->validate($request, $rules);

        $user = auth()->user();

        $data_to_update = [
            'password' => $request['password'],
        ];

        $user->update($data_to_update);

        $response =[
            'status' => 'Password Changed!',
            'user'=> $user,
        ];
        
        return response()->json($response);
    }
    
    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        $user_id = auth()->user()->id;
        $response = [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user()
        ];

        return response()->json($response);
    }

    public function signup(SignUpRequest $request){
        //CREATING
        $user = new User;
        $user->first_name = $request['first_name'];
        $user->last_name = $request['last_name'];
        $user->email = $request['email'];
        $user->password = $request['password'];
        $user->role_id = 1;
        $user->save();
        return response()->json(['message' => 'Account creation Successfully']);
    }
}