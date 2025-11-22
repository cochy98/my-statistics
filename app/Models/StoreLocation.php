<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'name',
        'address',
        'city',
        'province',
        'postal_code',
        'phone',
        'latitude',
        'longitude',
        'notes',
        'is_default',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_default' => 'boolean',
    ];

    // Relazione: una sede appartiene a un negozio
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    // Relazione: una sede può avere molte spese
    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    // Accessor per l'indirizzo completo formattato
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address,
            $this->postal_code,
            $this->city,
            $this->province,
        ]);

        return implode(', ', $parts) ?: '';
    }

    // Scope per ottenere la sede principale
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    // Scope per filtrare per città
    public function scopeByCity($query, string $city)
    {
        return $query->where('city', $city);
    }

    // Scope per filtrare per provincia
    public function scopeByProvince($query, string $province)
    {
        return $query->where('province', $province);
    }
}

