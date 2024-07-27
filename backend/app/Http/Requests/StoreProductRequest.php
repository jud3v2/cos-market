<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        //TODO: change here if client too can create product
        // admin only can store products
        //$role = json_decode($this->user()->roles);
        //if ($role[0] === 'admin') {
            return true;
        //}
        //return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => 'required|string',
            'item_id' => 'required|string',
            'stock' => 'required|integer',
            'name' => 'required|string',
            'price' => 'required|numeric',
            'isActive' => 'required|boolean',
            'description' => 'required|string|min:10',
        ];
    }
}
