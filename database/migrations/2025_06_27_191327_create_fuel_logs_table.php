<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fuel_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->decimal('amount', 8, 2)->nullable(); // Importo (€)
            $table->decimal('liters', 8, 2)->nullable(); // Litri
            $table->decimal('price_per_liter', 5, 3)->nullable(); // Prezzo al litro (€)
            $table->decimal('km_travelled', 8, 1)->nullable(); // KM percorsi
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fuel_logs');
    }
};
