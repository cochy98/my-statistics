<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FuelLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'date',
        'amount',
        'liters',
        'price_per_liter',
        'km_travelled',
        'notes',
    ];

    protected $appends = [
        'km_per_liter',
        'euro_per_km',
    ];

    // Relazione: un log di rifornimento appartiene a un veicolo
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    // Accessor: km/litro (efficienza)
    public function getKmPerLiterAttribute()
    {
        if ($this->km_travelled && $this->liters && $this->liters != 0) {
            return round($this->km_travelled / $this->liters, 2);
        }
        return null;
    }

    // Accessor: costo per km
    public function getEuroPerKmAttribute()
    {
        if ($this->amount && $this->km_travelled && $this->km_travelled != 0) {
            return round($this->amount / $this->km_travelled, 3);
        }
        return null;
    }
}
