<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Distributor;
use App\Models\DistributorAddress;
use App\Models\DistributorRank;
use App\Models\Rank;
use App\Models\Address;
use App\Models\AddressType;
use Illuminate\Http\Request;
use App\Http\Requests\SignUpRequest;
use Spatie\Permission\Models\Role;
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

        $distributor = new Distributor;
        
        $user_id = auth()->user()->id;
        $distributor = $distributor->whereHas('users', function($q) use ($user_id){
            $q->where('user_id', $user_id);
        })->first();

        if($distributor){
            if($distributor->verified == 0)
                return response()->json(['error' => "The distributor account hasn't been accepted in our system."], 401);
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
        $distributor = $user->distributors()->first();
        $distributor->points = $distributor->points()->first();
        $distributor->rank = $distributor->ranks()->first();

        if(Storage::disk('public')->exists($user->image))
            $user->image = 'data:image/jpg;base64,' . base64_encode(Storage::disk('public')->get($user->image));

        $response =[
            'user'=> $user,
            'distributor' => $distributor,
            'distributor_address' => $distributor->address()->first(),
            'rank' => $distributor->ranks()->latest()->first(),
        ];

        // $user_id = auth()->user()->id;
        // $distributor = new Distributor;
        // $distributor = $distributor->whereHas('users', function($q) use ($user_id){
        //     $q->where('user_id', $user_id);
        // })->first();
        // if($distributor){
        //     $response['distributor'] = $distributor;
        // }

        // $user = User::find($user_id); 
        // if($user->hasRole('admin')){
        //     $response['admin'] = true;
        // }
        
        return response()->json($response);
    }

    public function putMe(Request $request)
    {
        $update_data = $request->form_data;
        
        $user = auth()->user();

        $data_to_update = [
            'first_name' => $update_data['first_name'],
            'last_name' => $update_data['last_name'],
            'email' => $update_data['email_address'],
        ];

        if (preg_match('/^data:image\/(\w+);base64,/', $update_data['image'])) {
            $image_64 = $update_data['image'];

            $extension = explode('/', explode(':', substr($image_64, 0, strpos($image_64, ';')))[1])[1];   // .jpg .png .pdf

            $replace = substr($image_64, 0, strpos($image_64, ',')+1); 

            // find substring fro replace here eg: data:image/png;base64,

            $image = str_replace($replace, '', $image_64); 

            $image = str_replace(' ', '+', $image); 

            $image_directory = 'users/images/';
            $image_name = date("Ymdhis").'.'.$extension;

            if($user->image)
                Storage::disk('public')->delete($user->image);
                
            Storage::disk('public')->put($image_directory . $image_name, base64_decode($image));

            $data_to_update['image'] = $image_directory . $image_name;
        }

        $user->update($data_to_update);

        $distributor = $user->distributors()->first();
        $distributor->update([
            'contact_number' => $update_data['contact_number'],
            'facebook_name' => $update_data['facebook_name'],
            'instagram_name' => $update_data['instagram_name'],
        ]);

        $distributor_address = $distributor->address()->first();
        $distributor_address->update([
            'city' => $update_data['city'],
            'state' => $update_data['state'],
        ]);

        if(Storage::disk('public')->exists($user->image))
            $user->image = 'data:image/jpg;base64,' . base64_encode(Storage::disk('public')->get($user->image));
            
        $response =[
            'user'=> $user,
            'distributor' => $distributor,
            'distributor_address' => $distributor_address
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
        $distributor = new Distributor;
        $distributor = $distributor->whereHas('users', function($q) use ($user_id){
            $q->where('user_id', $user_id);
        })->first();
        if($distributor){
            $response['distributor'] = $distributor;
        }

        $user = User::find($user_id); 
        if($user->hasRole('admin') || $user->hasRole('sales') ){
            $response['admin'] = true;
        }

        return response()->json($response);
    }

    public function signup(SignUpRequest $request){
        //CREATING
        $user = new User;
        $user->first_name = $request['first_name'];
        $user->last_name = $request['last_name'];
        $user->email = $request['email'];
        $user->password = $request['password'];
        $user->save();

        $user_id = $user->id;
        
        $distributor = new Distributor;
        $distributor->distributor_code = 'SKM'.date('mY').(substr('00000',0,-strlen($user_id)).$user_id);
        //$distributor->distributor_code = 'SKE'.substr(substr('0000',0,-strlen($user_id)).$user_id .substr(strtotime(date('Y-m-d H:m:s')),0,11),0,15);
        $distributor->contact_number = $request['contact'];
        $distributor->facebook = $request['facebook'];
        $distributor->facebook_name = $request['facebook_name'];
        $distributor->instagram = $request['instagram'];
        $distributor->instagram_name = $request['instagram_name'];
        $distributor->referral_code = $request['referral_code'];
        $distributor->verified = false;
        $distributor->save();

        $user->distributors()->attach($distributor->id);
        $user->assignRole('distributor');
        //ASSIGNING AND CREATING ADDRESS OF DISTRIBUTOR
        $distributor_address = new Address;
        $distributor_address->address_line1 = $request['address_line1'];
        $distributor_address->address_line2 = $request['address_line2'];
        $distributor_address->city = $request['city'];
        $distributor_address->state = $request['state'];
        $distributor_address->country = 'Philippines';
        $distributor_address->zip_code = $request['zip_code'];
        $distributor_address->address_type_id = 1;
        
        $distributor_address->save();

        $distributor->address()->attach($distributor_address->id);
        
        //ASSIGNING RANK TO DISTRIBUTOR
        $rank_id = Rank::where('slug',$request['rank'])->first()->id;

        $distributor_ranks = new DistributorRank;
        $distributor_ranks->distributor_id = $distributor->id;
        $distributor_ranks->rank_id = $rank_id;
        $distributor_ranks->area = $request['area'];
        $distributor_ranks->save();
        return response()->json(['message' => 'Account creation Successfully']);
    }
}