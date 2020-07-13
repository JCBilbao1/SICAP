<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignUpRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
            'address_line1' => 'required',
            'city' => 'required',
            'contact' => 'required',
            'state' => 'required',
            'zip_code' => 'required',
            'rank' => 'required',
            'facebook' => 'required',
            'instagram' => 'required',
            'facebook_name' => 'required',
            'instagram_name' => 'required',
            'referral_code' => 'nullable|exists:distributors,distributor_code',
        ];
    }
}
