<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'description',
    ];

    // Relazione: un negozio può avere molte spese (tramite le sedi)
    public function expenses()
    {
        return $this->hasManyThrough(Expense::class, StoreLocation::class);
    }

    // Relazione: un negozio può avere più sedi
    public function locations()
    {
        return $this->hasMany(StoreLocation::class);
    }

    // Relazione: sede principale (default)
    public function defaultLocation()
    {
        return $this->hasOne(StoreLocation::class)->where('is_default', true);
    }

    // Scope per cercare negozi per tipo
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }
}
