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
        Schema::table('expenses', function (Blueprint $table) {
            // Aggiungi la nuova colonna store_location_id
            $table->foreignId('store_location_id')->nullable()->after('store_id')->constrained('store_locations')->onDelete('set null');
            
            // Mantieni store_id per retrocompatibilità, ma lo renderemo nullable
            // Se store_id esiste ma non c'è store_location_id, possiamo creare una sede di default
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropForeign(['store_location_id']);
            $table->dropColumn('store_location_id');
        });
    }
};

