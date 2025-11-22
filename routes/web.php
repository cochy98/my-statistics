<?php

use App\Http\Controllers\FuelLogController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Rotte per i veicoli
    Route::resource('vehicles', VehicleController::class);
    
    // Rotte per i fuel logs
    Route::resource('fuel-logs', FuelLogController::class);
    
    // Rotte per le spese
    Route::resource('expenses', ExpenseController::class);
    Route::get('/expense-stats', [ExpenseController::class, 'stats'])->name('expenses.stats');
    
    // Rotte per i negozi
    Route::resource('stores', StoreController::class);
    Route::post('/stores/{store}/locations', [StoreController::class, 'storeLocation'])->name('stores.locations.store');
    Route::put('/stores/{store}/locations/{location}', [StoreController::class, 'updateLocation'])->name('stores.locations.update');
    Route::delete('/stores/{store}/locations/{location}', [StoreController::class, 'destroyLocation'])->name('stores.locations.destroy');
    
    // Rotte legacy per compatibilità
    Route::get('/fuel-stats', [FuelLogController::class, 'index'])->name('fuel.stats');
    
    // Rotte per gestione veicolo preferito
    Route::post('/vehicles/{vehicle}/set-preferred', [FuelLogController::class, 'setPreferredVehicle'])->name('vehicles.set-preferred');
    Route::post('/remove-preferred-vehicle', [FuelLogController::class, 'removePreferredVehicle'])->name('vehicles.remove-preferred');
});

require __DIR__.'/settings.php';
