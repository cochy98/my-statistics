<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FuelLogController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $vehicle = $user->vehicles()->with('fuelLogs')->first();

        return Inertia::render('FuelStats', [
            'vehicle' => $vehicle,
            'fuelLogs' => $vehicle?->fuelLogs()->orderBy('date')->get()
        ]);
    }
}
