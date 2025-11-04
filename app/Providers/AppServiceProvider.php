<?php

namespace App\Providers;

use App\Models\Expense;
use App\Models\FuelLog;
use App\Models\Vehicle;
use App\Policies\ExpensePolicy;
use App\Policies\FuelLogPolicy;
use App\Policies\VehiclePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Vehicle::class => VehiclePolicy::class,
        FuelLog::class => FuelLogPolicy::class,
        Expense::class => ExpensePolicy::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
