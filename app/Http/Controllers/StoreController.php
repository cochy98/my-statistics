<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreLocation;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class StoreController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Store::with('locations')->withCount('locations');

        // Filtro per tipo
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Ricerca per nome
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $stores = $query->orderBy('name')->paginate(20);

        // Tipi disponibili per il filtro
        $types = Store::select('type')
            ->whereNotNull('type')
            ->distinct()
            ->orderBy('type')
            ->pluck('type');

        return Inertia::render('Stores/Index', [
            'stores' => $stores,
            'types' => $types,
            'filters' => $request->only(['type', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Stores/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:stores,name',
            'type' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $store = Store::create($validated);

        return redirect()->route('stores.index')
            ->with('success', 'Negozio creato con successo!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Store $store)
    {
        $store->load('locations');

        return Inertia::render('Stores/Show', [
            'store' => $store,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Store $store)
    {
        $store->load('locations');

        return Inertia::render('Stores/Edit', [
            'store' => $store,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Store $store)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:stores,name,' . $store->id,
            'type' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $store->update($validated);

        return redirect()->route('stores.index')
            ->with('success', 'Negozio aggiornato con successo!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store)
    {
        $store->delete();

        return redirect()->route('stores.index')
            ->with('success', 'Negozio eliminato con successo!');
    }

    /**
     * Store a new location for the store.
     */
    public function storeLocation(Request $request, Store $store)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:2',
            'postal_code' => 'nullable|string|max:10',
            'phone' => 'nullable|string|max:50',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'notes' => 'nullable|string|max:1000',
            'is_default' => 'boolean',
        ]);

        // Se questa è la prima sede o se is_default è true, imposta le altre come non default
        if ($validated['is_default'] ?? false) {
            StoreLocation::where('store_id', $store->id)
                ->update(['is_default' => false]);
        } elseif (StoreLocation::where('store_id', $store->id)->count() === 0) {
            $validated['is_default'] = true;
        }

        $store->locations()->create($validated);

        return redirect()->route('stores.edit', $store)
            ->with('success', 'Sede aggiunta con successo!');
    }

    /**
     * Update a location for the store.
     */
    public function updateLocation(Request $request, Store $store, StoreLocation $location)
    {
        // Verifica che la location appartenga al negozio
        if ($location->store_id !== $store->id) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:2',
            'postal_code' => 'nullable|string|max:10',
            'phone' => 'nullable|string|max:50',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'notes' => 'nullable|string|max:1000',
            'is_default' => 'boolean',
        ]);

        // Se is_default è true, imposta le altre come non default
        if ($validated['is_default'] ?? false) {
            StoreLocation::where('store_id', $store->id)
                ->where('id', '!=', $location->id)
                ->update(['is_default' => false]);
        }

        $location->update($validated);

        return redirect()->route('stores.edit', $store)
            ->with('success', 'Sede aggiornata con successo!');
    }

    /**
     * Remove a location from the store.
     */
    public function destroyLocation(Store $store, StoreLocation $location)
    {
        // Verifica che la location appartenga al negozio
        if ($location->store_id !== $store->id) {
            abort(404);
        }

        $location->delete();

        return redirect()->route('stores.edit', $store)
            ->with('success', 'Sede eliminata con successo!');
    }
}

