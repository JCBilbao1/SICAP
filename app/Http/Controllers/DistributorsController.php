<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Distributor;
use App\Models\User;
use App\Models\DistributorRank;
use App\Models\Rank;
use App\Models\Address;
class DistributorsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $distributor = new User;
       
        $distributor =  $distributor->with(['distributors'=>function($q){
            $q->with(['ranks'=>function($q){
                $q->orderBy('pivot_created_at','DESC')->get();
            }]);
        }])->whereHas('distributors',function($q){
            $q->where('verified', 1);
        })->get();
        return response()->json($distributor);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $distributor = new User;
       
        $distributor =  $distributor->with(['distributors'=>function($q){
            $q->with(['ranks'=>function($q){
                $q->orderBy('pivot_created_at','DESC')->limit(1)->get();
            }])->with('address');
        }])->whereHas('distributors',function($q) use ($id){
            $q->where('distributors.id', $id)->whereNull('deleted_at');
        })->first();
        $distributor->referral_data = null;
        if($distributor->distributors[0]->referral_code){
            $referral_code = $distributor->distributors[0]->referral_code;
            $distributor->referral_data = User::with('distributors')->whereHas('distributors', function($q) use ($referral_code){
                $q->where('distributor_code', $referral_code);
            })->first();
        }

        return response()->json($distributor);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        /*
        $distributor = Distributor::find($id);
        $distributor->contact_number = $request->contact_number;
        $distributor->save();
        $rank = $distributor->rank();
        $rank->rank_id = $request->ranks->[0];
        $rank->area = $request->ranks;
        $rank->save();
        $address = $distributor->address();
        $address->address_line1 = 
        $address->address_line2
        $address->city
        $address->state
        $address->country
        $address->zip_code
        $address->save();

        */
        
        

      
        $user = User::find($request['id']);
        $user->first_name = $request['first_name'];
        $user->last_name = $request['last_name'];
        $user->email = $request['email'];
        $user->save();

        $distributor = Distributor::find($id);
        $distributor->contact_number = $request['distributors'][0]['contact_number'];
        $distributor->facebook = $request['distributors'][0]['facebook'];
        $distributor->instagram = $request['distributors'][0]['instagram'];
        $distributor->facebook_name = $request['distributors'][0]['facebook_name'];
        $distributor->instagram_name = $request['distributors'][0]['instagram_name'];
        $distributor->save();

        $check_rank = DistributorRank::where('distributor_id', $id)->latest()->first();

        $search_rank_id = Rank::where('slug',$request['distributors'][0]['ranks'][0]['slug'])->first()->id;

        if($check_rank->rank_id != $search_rank_id){
            $distributor_ranks = new DistributorRank;
            $distributor_ranks->distributor_id = $distributor->id;
            $distributor_ranks->rank_id = $search_rank_id;
            $distributor_ranks->area = $request['distributors'][0]['ranks'][0]['pivot']['area'];
            $distributor_ranks->save();
        } else {
            if($check_rank->area != $request['distributors'][0]['ranks'][0]['pivot']['area']){
                $distributor_ranks = new DistributorRank;
                $distributor_ranks->distributor_id = $distributor->id;
                $distributor_ranks->rank_id = $search_rank_id;
                $distributor_ranks->area = $request['distributors'][0]['ranks'][0]['pivot']['area'];
                $distributor_ranks->save();
            }
        }
        
        $address = Address::find($request['distributors'][0]['address'][0]['id']);
        $address->address_line1 = $request['distributors'][0]['address'][0]['address_line1'];
        $address->address_line2 = $request['distributors'][0]['address'][0]['address_line2'];
        $address->city = $request['distributors'][0]['address'][0]['city'];
        $address->state = $request['distributors'][0]['address'][0]['state'];
        $address->zip_code = $request['distributors'][0]['address'][0]['zip_code'];
        $address->save();

        return response()->json(['status'=>'Success']);

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
    public function getIndex(Request $request){
        $distributor = new User;
        $distributor =  $distributor->with(['distributors'=>function($q){
            $q->with('ranks');
        }])->has('distributors')->get();

        return response()->json($distributor);
    }
    public function getUnverified(Request $request){
        $distributor = new User;
        
        $distributor = $distributor->with(['distributors'=>function($q){
            $q->with('ranks');
        }])->whereHas('distributors', function($q){
            $q->where('verified', 0)->whereNull('deleted_at');
        })->get();

        return response()->json($distributor);
    }

    public function deleteTemporary($id){
        $distributor = Distributor::findorfail($id);
        $distributor->delete();
        return response()->json(['message'=>'Successfuly Deleted!']);
    }
    public function putUpdateVerified(Request $request){

        $distributor = Distributor::find($request['id']);
        $distributor->verified = $request['verified'];
        $distributor->save();
        return response()->json(['message'=>'Update Successful!']);
    }
    public function putUpdate(Request $request){
        $distributor = Distributor::find($request['id']);
        $distributor->distributor_code = $request['distributor_code'];
        $distributor->contact_number = $request['contact_number'];
        $distributor->verified = $request['verified'];
        $distributor->save();

        return response()->json(['message'=>'Update Successful!']);
    }
}
