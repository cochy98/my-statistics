<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VehicleController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $vehicles = Auth::user()->vehicles()->withCount('fuelLogs')->get();

        return Inertia::render('Vehicles/Index', [
            'vehicles' => $vehicles,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Vehicles/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVehicleRequest $request)
    {
        $vehicle = Auth::user()->vehicles()->create($request->validated());

        return redirect()->route('vehicles.index')
            ->with('success', 'Veicolo creato con successo!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Vehicle $vehicle)
    {
        // Verifica che il veicolo appartenga all'utente autenticato
        $this->authorize('view', $vehicle);

        $vehicle->load(['fuelLogs' => function ($query) {
            $query->orderBy('date', 'desc');
        }]);

        return Inertia::render('Vehicles/Show', [
            'vehicle' => $vehicle,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vehicle $vehicle)
    {
        // Verifica che il veicolo appartenga all'utente autenticato
        $this->authorize('update', $vehicle);

        return Inertia::render('Vehicles/Edit', [
            'vehicle' => $vehicle
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle)
    {
        // Verifica che il veicolo appartenga all'utente autenticato
        $this->authorize('update', $vehicle);

        $vehicle->update($request->validated());

        return redirect()->route('vehicles.index')
            ->with('success', 'Veicolo aggiornato con successo!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        // Verifica che il veicolo appartenga all'utente autenticato
        $this->authorize('delete', $vehicle);

        $vehicle->delete();

        return redirect()->route('vehicles.index')
            ->with('success', 'Veicolo eliminato con successo!');
    }
}
