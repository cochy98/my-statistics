<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Store;
use App\Models\Category;
use App\Models\Expense;
use Carbon\Carbon;

class ImportExpensesFromCsv extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'expenses:import-csv {file} {--user-id=1}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importa le spese da un file CSV';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = $this->argument('file');
        $userId = $this->option('user-id');

        if (!file_exists($filePath)) {
            $this->error("File non trovato: $filePath");
            return 1;
        }

        $user = User::find($userId);
        if (!$user) {
            $this->error("Utente con ID $userId non trovato");
            return 1;
        }

        $this->info("Importazione spese per l'utente: {$user->name}");

        // Prima creiamo le categorie se non esistono
        $this->call('db:seed', ['--class' => 'CategorySeeder']);

        $csvData = array_map('str_getcsv', file($filePath));
        $header = array_shift($csvData);

        $imported = 0;
        $skipped = 0;

        foreach ($csvData as $row) {
            if (count($row) < 5) {
                $skipped++;
                continue;
            }

            $week = trim($row[0]);
            $date = trim($row[1]);
            $storeName = trim($row[2]);
            $description = trim($row[3]);
            $amount = floatval(str_replace(',', '.', trim($row[4])));

            if ($amount <= 0) {
                $skipped++;
                continue;
            }

            try {
                $expenseDate = Carbon::createFromFormat('d/m/Y', $date);
            } catch (\Exception $e) {
                $this->warn("Data non valida: $date");
                $skipped++;
                continue;
            }

            $weekIdentifier = $expenseDate->format('Y-\WW');

            // Creiamo o troviamo il negozio
            $store = null;
            if (!empty($storeName)) {
                $store = Store::firstOrCreate(
                    ['name' => $storeName],
                    ['name' => $storeName, 'type' => 'other']
                );
            }

            // Determiniamo la categoria
            $categorySlug = $this->determineCategory($storeName, $description);
            $category = Category::where('slug', $categorySlug)->first();

            // Creiamo la spesa
            Expense::create([
                'user_id' => $user->id,
                'store_id' => $store?->id,
                'category_id' => $category?->id,
                'date' => $expenseDate,
                'week_identifier' => $weekIdentifier,
                'amount' => $amount,
                'description' => !empty($description) ? $description : null,
            ]);

            $imported++;
        }

        $this->info("Importazione completata!");
        $this->info("Spese importate: $imported");
        $this->info("Righe saltate: $skipped");

        return 0;
    }

    private function determineCategory($storeName, $description)
    {
        $storeCategoryMap = [
            'Sole 365' => 'alimentari',
            'MD' => 'alimentari',
            'Lidl' => 'alimentari',
            'Iper Superò' => 'alimentari',
            'Pescheria' => 'alimentari',
            'Polleria' => 'alimentari',
            'Pollo e Tacchino' => 'alimentari',
            'Pesce' => 'alimentari',
            'Frutta' => 'alimentari',
            'Ortofrutta' => 'alimentari',
            'Pane' => 'alimentari',
            'Pasticceria' => 'alimentari',
            'Casalingo' => 'alimentari',
            'Dentifricio e caffè' => 'alimentari',
            'Parigina' => 'salute',
            'Ammorbidente' => 'casa',
            'Puck' => 'casa',
            'Cose per la casa' => 'casa',
            'Carta igienica' => 'casa',
            'Detergenti' => 'casa',
        ];

        if (isset($storeCategoryMap[$storeName])) {
            return $storeCategoryMap[$storeName];
        }

        $descriptionLower = strtolower($description);
        
        if (str_contains($descriptionLower, 'shampoo') || 
            str_contains($descriptionLower, 'bellezza')) {
            return 'bellezza';
        }
        
        if (str_contains($descriptionLower, 'casa') ||
            str_contains($descriptionLower, 'pulizia')) {
            return 'casa';
        }

        return 'alimentari';
    }
}
