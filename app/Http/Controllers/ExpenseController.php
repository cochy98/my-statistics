<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Store;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Carbon\Carbon;

class ExpenseController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = auth()->user()->expenses()->with(['store', 'category']);

        // Filtri
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('store_id')) {
            $query->where('store_id', $request->store_id);
        }

        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        if ($request->filled('week')) {
            $query->where('week_identifier', $request->week);
        }

        // Ordinamento
        $sortBy = $request->get('sort_by', 'date');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $expenses = $query->paginate(20);

        // Dati per i filtri
        $categories = Category::orderBy('name')->get();
        $stores = Store::orderBy('name')->get();
        
        // Settimane disponibili
        $weeks = auth()->user()->expenses()
            ->select('week_identifier')
            ->distinct()
            ->orderBy('week_identifier', 'desc')
            ->pluck('week_identifier');

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'categories' => $categories,
            'stores' => $stores,
            'weeks' => $weeks,
            'filters' => $request->only(['category_id', 'store_id', 'date_from', 'date_to', 'week', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::orderBy('name')->get();
        $stores = Store::orderBy('name')->get();

        return Inertia::render('Expenses/Create', [
            'categories' => $categories,
            'stores' => $stores,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'store_id' => 'nullable|exists:stores,id',
            'category_id' => 'nullable|exists:categories,id',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['week_identifier'] = Expense::generateWeekIdentifier($validated['date']);

        Expense::create($validated);

        return redirect()->route('expenses.index')
            ->with('success', 'Spesa registrata con successo!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        $this->authorize('view', $expense);

        $expense->load(['store', 'category']);

        return Inertia::render('Expenses/Show', [
            'expense' => $expense,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expense $expense)
    {
        $this->authorize('update', $expense);

        $categories = Category::orderBy('name')->get();
        $stores = Store::orderBy('name')->get();

        return Inertia::render('Expenses/Edit', [
            'expense' => $expense,
            'categories' => $categories,
            'stores' => $stores,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expense $expense)
    {
        $this->authorize('update', $expense);

        $validated = $request->validate([
            'store_id' => 'nullable|exists:stores,id',
            'category_id' => 'nullable|exists:categories,id',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $validated['week_identifier'] = Expense::generateWeekIdentifier($validated['date']);

        $expense->update($validated);

        return redirect()->route('expenses.index')
            ->with('success', 'Spesa aggiornata con successo!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        $this->authorize('delete', $expense);

        $expense->delete();

        return redirect()->route('expenses.index')
            ->with('success', 'Spesa eliminata con successo!');
    }

    /**
     * Display expense statistics
     */
    public function stats(Request $request)
    {
        $user = auth()->user();
        
        // Periodo di default: ultimi 3 mesi
        $defaultFrom = Carbon::now()->subMonths(3)->startOfMonth();
        $defaultTo = Carbon::now()->endOfMonth();
        
        $from = $request->get('from', $defaultFrom->format('Y-m-d'));
        $to = $request->get('to', $defaultTo->format('Y-m-d'));

        $expenses = $user->expenses()
            ->with(['store', 'category'])
            ->whereBetween('date', [$from, $to])
            ->get();

        // Statistiche per categoria
        $categoryStats = $expenses->groupBy('category.name')
            ->map(function ($categoryExpenses, $categoryName) {
                return [
                    'name' => $categoryName ?: 'Non categorizzato',
                    'total' => $categoryExpenses->sum('amount'),
                    'count' => $categoryExpenses->count(),
                    'average' => $categoryExpenses->avg('amount'),
                ];
            })
            ->sortByDesc('total')
            ->values();

        // Statistiche per negozio
        $storeStats = $expenses->groupBy('store.name')
            ->map(function ($storeExpenses, $storeName) {
                return [
                    'name' => $storeName ?: 'Non specificato',
                    'total' => $storeExpenses->sum('amount'),
                    'count' => $storeExpenses->count(),
                    'average' => $storeExpenses->avg('amount'),
                ];
            })
            ->sortByDesc('total')
            ->take(10)
            ->values();

        // Spese per settimana
        $weeklyStats = $expenses->groupBy('week_identifier')
            ->map(function ($weekExpenses, $week) {
                return [
                    'week' => $week,
                    'total' => $weekExpenses->sum('amount'),
                    'count' => $weekExpenses->count(),
                ];
            })
            ->sortBy('week')
            ->values();

        // Statistiche generali
        $totalAmount = $expenses->sum('amount');
        $totalCount = $expenses->count();
        $averageAmount = $totalCount > 0 ? $totalAmount / $totalCount : 0;

        return Inertia::render('Expenses/Stats', [
            'expenses' => $expenses,
            'categoryStats' => $categoryStats,
            'storeStats' => $storeStats,
            'weeklyStats' => $weeklyStats,
            'totalAmount' => $totalAmount,
            'totalCount' => $totalCount,
            'averageAmount' => $averageAmount,
            'period' => [
                'from' => $from,
                'to' => $to,
            ],
        ]);
    }
}
