<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'model',
        'plate_number',
    ];

    // Relazione: un veicolo appartiene a un utente
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relazione: un veicolo ha molti rifornimenti
    public function fuelLogs()
    {
        return $this->hasMany(FuelLog::class);
    }
}
