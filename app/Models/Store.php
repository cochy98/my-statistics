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

    // Relazione: un negozio può avere molte spese
    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    // Scope per cercare negozi per tipo
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }
}
