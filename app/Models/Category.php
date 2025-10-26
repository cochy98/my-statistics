<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'color',
        'icon',
        'description',
    ];

    // Relazione: una categoria può avere molte spese
    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    // Scope per cercare categoria per slug
    public function scopeBySlug($query, $slug)
    {
        return $query->where('slug', $slug);
    }
}
