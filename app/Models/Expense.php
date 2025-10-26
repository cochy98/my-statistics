<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'store_id',
        'category_id',
        'date',
        'week_identifier',
        'amount',
        'description',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
    ];

    // Relazione: una spesa appartiene a un utente
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relazione: una spesa appartiene a un negozio
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    // Relazione: una spesa appartiene a una categoria
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Scope per filtrare per settimana
    public function scopeForWeek($query, $weekIdentifier)
    {
        return $query->where('week_identifier', $weekIdentifier);
    }

    // Scope per filtrare per categoria
    public function scopeForCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    // Scope per filtrare per negozio
    public function scopeForStore($query, $storeId)
    {
        return $query->where('store_id', $storeId);
    }

    // Scope per filtrare per periodo
    public function scopeForPeriod($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    // Metodo statico per generare week_identifier da una data
    public static function generateWeekIdentifier($date)
    {
        $carbon = Carbon::parse($date);
        return $carbon->format('Y-\WW');
    }

    // Accessor per formattare l'importo
    public function getFormattedAmountAttribute()
    {
        return '€ ' . number_format($this->amount, 2, ',', '.');
    }
}
