<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFuelLogRequest;
use App\Http\Requests\UpdateFuelLogRequest;
use App\Models\FuelLog;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FuelLogController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $vehicle = $user->vehicles()->with('fuelLogs')->first();

        return Inertia::render('FuelStats', [
            'vehicle' => $vehicle,
            'fuelLogs' => $vehicle?->fuelLogs()->orderBy('date')->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $vehicles = Auth::user()->vehicles()->get();
        
        // Precompila il veicolo se specificato nel query parameter
        $selectedVehicleId = $request->query('vehicle_id');
        $selectedVehicle = null;
        
        if ($selectedVehicleId) {
            $selectedVehicle = $vehicles->find($selectedVehicleId);
        }

        return Inertia::render('FuelLogs/Create', [
            'vehicles' => $vehicles,
            'selectedVehicleId' => $selectedVehicleId,
            'selectedVehicle' => $selectedVehicle
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFuelLogRequest $request)
    {
        // Verifica che il veicolo appartenga all'utente autenticato
        $vehicle = Auth::user()->vehicles()->findOrFail($request->vehicle_id);

        $fuelLog = $vehicle->fuelLogs()->create($request->validated());

        return redirect()->route('vehicles.show', $vehicle)
            ->with('success', 'Rifornimento registrato con successo!');
    }

    /**
     * Display the specified resource.
     */
    public function show(FuelLog $fuelLog)
    {
        // Verifica che il fuel log appartenga a un veicolo dell'utente autenticato
        $this->authorize('view', $fuelLog);

        $fuelLog->load('vehicle');

        return Inertia::render('FuelLogs/Show', [
            'fuelLog' => $fuelLog
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FuelLog $fuelLog)
    {
        // Verifica che il fuel log appartenga a un veicolo dell'utente autenticato
        $this->authorize('update', $fuelLog);

        $vehicles = Auth::user()->vehicles()->get();

        return Inertia::render('FuelLogs/Edit', [
            'fuelLog' => $fuelLog,
            'vehicles' => $vehicles
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFuelLogRequest $request, FuelLog $fuelLog)
    {
        // Verifica che il fuel log appartenga a un veicolo dell'utente autenticato
        $this->authorize('update', $fuelLog);

        $fuelLog->update($request->validated());

        return redirect()->route('vehicles.show', $fuelLog->vehicle)
            ->with('success', 'Rifornimento aggiornato con successo!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FuelLog $fuelLog)
    {
        // Verifica che il fuel log appartenga a un veicolo dell'utente autenticato
        $this->authorize('delete', $fuelLog);

        $vehicle = $fuelLog->vehicle; // Salva il riferimento al veicolo prima di eliminare
        $fuelLog->delete();

        return redirect()->route('vehicles.show', $vehicle)
            ->with('success', 'Rifornimento eliminato con successo!');
    }
}
