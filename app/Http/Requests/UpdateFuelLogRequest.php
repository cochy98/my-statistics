<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFuelLogRequest extends FormRequest
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
            'vehicle_id' => ['required', 'exists:vehicles,id'],
            'date' => ['required', 'date', 'before_or_equal:today'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'liters' => ['required', 'numeric', 'min:0.01'],
            'price_per_liter' => ['nullable', 'numeric', 'min:0.001'],
            'km_travelled' => ['nullable', 'numeric', 'min:0.1'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'vehicle_id.required' => 'Il veicolo è obbligatorio.',
            'vehicle_id.exists' => 'Il veicolo selezionato non esiste.',
            'date.required' => 'La data è obbligatoria.',
            'date.date' => 'La data deve essere valida.',
            'date.before_or_equal' => 'La data non può essere futura.',
            'amount.required' => 'L\'importo è obbligatorio.',
            'amount.numeric' => 'L\'importo deve essere un numero.',
            'amount.min' => 'L\'importo deve essere maggiore di 0.',
            'liters.required' => 'I litri sono obbligatori.',
            'liters.numeric' => 'I litri devono essere un numero.',
            'liters.min' => 'I litri devono essere maggiori di 0.',
            'price_per_liter.numeric' => 'Il prezzo al litro deve essere un numero.',
            'price_per_liter.min' => 'Il prezzo al litro deve essere maggiore di 0.',
            'km_travelled.numeric' => 'I km percorsi devono essere un numero.',
            'km_travelled.min' => 'I km percorsi devono essere maggiori di 0.',
            'notes.string' => 'Le note devono essere testo.',
            'notes.max' => 'Le note non possono superare i 1000 caratteri.',
        ];
    }
}
