<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'model' => ['required', 'string', 'max:255'],
            'plate_number' => ['required', 'string', 'max:20', 'unique:vehicles,plate_number'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'model.required' => 'Il modello del veicolo è obbligatorio.',
            'model.max' => 'Il modello non può superare i 255 caratteri.',
            'plate_number.required' => 'Il numero di targa è obbligatorio.',
            'plate_number.max' => 'Il numero di targa non può superare i 20 caratteri.',
            'plate_number.unique' => 'Questa targa è già registrata.',
        ];
    }
}
