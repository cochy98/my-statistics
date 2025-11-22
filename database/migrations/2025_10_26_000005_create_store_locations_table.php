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
        Schema::create('store_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->string('name')->nullable(); // Nome della sede (es. "Centro", "Periferia Nord")
            $table->string('address')->nullable(); // Indirizzo completo
            $table->string('city')->nullable(); // Città
            $table->string('province', 2)->nullable(); // Provincia (sigla a 2 caratteri)
            $table->string('postal_code', 10)->nullable(); // CAP
            $table->string('phone')->nullable(); // Telefono
            $table->decimal('latitude', 10, 8)->nullable(); // Coordinate GPS
            $table->decimal('longitude', 11, 8)->nullable(); // Coordinate GPS
            $table->text('notes')->nullable(); // Note aggiuntive
            $table->boolean('is_default')->default(false); // Sede principale
            $table->timestamps();

            $table->index('store_id');
            $table->index(['city', 'province']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_locations');
    }
};

