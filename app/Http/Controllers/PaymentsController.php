<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Str;
use Illuminate\Database\QueryException;

class PaymentsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $payment = Payment::all();
        return response()->json($payment);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $payment_data = $request->all();

        $for_validation = [
            'name' => 'required',
        ];

        if (!empty(trim($payment_data['name'])) && empty(trim($payment_data['slug']))) {
            $payment_data['slug'] = strtolower(Str::slug($payment_data['name'], '-'));
            $for_validation['slug'] = 'unique:payments';
        } else {
            $payment_data['slug'] = strtolower($payment_data['slug']);
            $for_validation['slug'] = 'required|unique:payments|alpha_dash';
        }
        $request->merge($payment_data);

        $request->validate($for_validation);

        $number=1;
        $slug = $payment_data['slug'];
        $new_payment = null;
        $created = false;

        do {
            try {
                $new_payment = Payment::create([
                    'name' => $payment_data['name'],
                    'slug' => $payment_data['slug'],
                    'description' => $payment_data['description'],
                ]);
                $created = true;
            } catch ( QueryException $e ) {
                $errorCode = $e->errorInfo[1];
                if($errorCode == 1062){
                    $created = false;
                    $payment_data['slug'] = $slug . '-' . $number;
                    $number++;
                }
            }
        } while ( !$created );
        
        return response()->json([
            'status' => 'Success',
            'new_payment' => $new_payment,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        $payment = Payment::where('slug', $slug)->first();
        return response()->json($payment);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $slug)
    {
       
        $payment_data = $request->all();
        $old_payment_data = payment::where('slug', $slug)->first();

        $for_validation = [
            'name' => 'required',
        ];

        if((trim($payment_data['slug']) == $old_payment_data->slug 
            && trim($payment_data['name']) != $old_payment_data->slug)
            || (!empty(trim($payment_data['name'])) && empty(trim($payment_data['slug'])))) {
            $payment_data['slug'] = strtolower(Str::slug($payment_data['name'], '-'));
        } else {
            $payment_data['slug'] = strtolower($payment_data['slug']);
            $for_validation['slug'] = 'required|unique:payments|alpha_dash';
        }
        $request->merge($payment_data);

        $request->validate($for_validation);

        $number=1;
        $slug = $payment_data['slug'];
        $updated = false;
        do {
            try {
                $payment = $old_payment_data->update([
                    'name' => $payment_data['name'],
                    'description' => $payment_data['description'],
                    'slug' => $payment_data['slug'],
                ]);
                $updated = true;
            } catch ( QueryException $e ) {
                $errorCode = $e->errorInfo[1];
                if($errorCode == 1062){
                    $created = false;
                    $payment_data['slug'] = $slug . '-' . $number;
                    $number++;
                }
            }
        } while ( !$updated );
        
        return response()->json($payment_data);
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

    public function deleteTemporary($id){
        $payment = Payment::find($id);
        $payment->delete();
        return response()->json(['message'=>'Successfuly Deleted!']);
    }
    
    public function putchangeStatus(Request $request,$id){
        $payment = Payment::find($id);
        $payment->active = $request['active'];
        $payment->save();
        return response()->json($payment);
    }

    public function getPaymentMethodsCheckOut() {
        $payments = Payment::where('active', 1)->get();
        return response()->json($payments);
    }
    
}
