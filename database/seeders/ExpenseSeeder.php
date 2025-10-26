<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Store;
use App\Models\Category;
use App\Models\Expense;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ExpenseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Prima eseguiamo il CategorySeeder per avere le categorie
        $this->call(CategorySeeder::class);

        // Leggiamo il CSV
        $csvFile = storage_path('app/spese.csv');
        
        if (!file_exists($csvFile)) {
            $this->command->error('File CSV non trovato: ' . $csvFile);
            return;
        }

        $csvData = array_map(function($line) {
            return str_getcsv($line, ';'); // Usa il punto e virgola come separatore
        }, file($csvFile));
        $header = array_shift($csvData); // Rimuoviamo l'header
        
        $this->command->info('Header CSV: ' . implode(' | ', $header));
        $this->command->info('Numero righe da processare: ' . count($csvData));

        // Otteniamo o creiamo un utente di test
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Utente Test',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        // Mappa per categorizzare automaticamente i negozi
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
            'Parigina' => 'alimentari',
            'Ammorbidente' => 'casa',
            'Puck' => 'casa',
            'Cose per la casa' => 'casa',
            'Carta igienica' => 'casa',
            'Detergenti' => 'casa',
        ];

        $imported = 0;
        $skipped = 0;

        foreach ($csvData as $index => $row) {
            $this->command->info("Riga " . ($index + 1) . ": " . implode(' | ', $row));
            
            if (count($row) < 5) {
                $this->command->warn("Riga " . ($index + 1) . " saltata: meno di 5 colonne");
                $skipped++;
                continue;
            }

            $week = trim($row[0]);
            $date = trim($row[1]);
            $storeName = trim($row[2]);
            $description = trim($row[3]);
            $amount = floatval(str_replace(',', '.', trim($row[4])));

            $this->command->info("Parsing: Settimana=$week, Data=$date, Negozio=$storeName, Descrizione=$description, Importo=$amount");

            // Skip se l'importo è 0 o vuoto
            if ($amount <= 0) {
                $this->command->warn("Riga " . ($index + 1) . " saltata: importo <= 0");
                $skipped++;
                continue;
            }

            // Parsing della data
            try {
                $expenseDate = Carbon::createFromFormat('d/m/Y', $date);
            } catch (\Exception $e) {
                $this->command->warn("Data non valida: $date");
                continue;
            }

            // Generiamo l'identificatore della settimana
            $weekIdentifier = $expenseDate->format('Y-\WW');

            // Creiamo o troviamo il negozio
            $store = null;
            if (!empty($storeName)) {
                $store = Store::firstOrCreate(
                    ['name' => $storeName],
                    [
                        'name' => $storeName,
                        'type' => $this->determineStoreType($storeName),
                        'description' => null,
                    ]
                );
            }

            // Determiniamo la categoria basandoci sul negozio o sulla descrizione
            $categorySlug = $this->determineCategory($storeName, $description, $storeCategoryMap);
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
                'notes' => null,
            ]);

            $imported++;
            $this->command->info("Spesa importata: €$amount da $storeName");
        }

        $this->command->info('Seeder completato!');
        $this->command->info("Spese importate: $imported");
        $this->command->info("Righe saltate: $skipped");
    }

    /**
     * Determina il tipo di negozio basandosi sul nome
     */
    private function determineStoreType($storeName)
    {
        $supermarkets = ['Sole 365', 'MD', 'Lidl', 'Iper Superò'];
        $specialty = ['Pescheria', 'Polleria', 'Pollo e Tacchino', 'Pesce', 'Frutta', 'Ortofrutta', 'Pane', 'Pasticceria'];
        $pharmacy = ['Parigina'];
        $household = ['Ammorbidente', 'Puck', 'Cose per la casa', 'Carta igienica', 'Detergenti'];

        if (in_array($storeName, $supermarkets)) {
            return 'supermarket';
        } elseif (in_array($storeName, $specialty)) {
            return 'specialty_food';
        } elseif (in_array($storeName, $pharmacy)) {
            return 'pharmacy';
        } elseif (in_array($storeName, $household)) {
            return 'household';
        }

        return 'other';
    }

    /**
     * Determina la categoria basandosi sul negozio e descrizione
     */
    private function determineCategory($storeName, $description, $storeCategoryMap)
    {
        // Prima controlliamo la mappa dei negozi
        if (isset($storeCategoryMap[$storeName])) {
            return $storeCategoryMap[$storeName];
        }

        // Poi controlliamo la descrizione per parole chiave
        $descriptionLower = strtolower($description);
        
        if (str_contains($descriptionLower, 'shampoo') || 
            str_contains($descriptionLower, 'bellezza') ||
            str_contains($descriptionLower, 'cosmetici')) {
            return 'bellezza';
        }
        
        if (str_contains($descriptionLower, 'casa') ||
            str_contains($descriptionLower, 'pulizia') ||
            str_contains($descriptionLower, 'detergenti')) {
            return 'casa';
        }

        if (str_contains($descriptionLower, 'farmacia') ||
            str_contains($descriptionLower, 'medicina') ||
            str_contains($descriptionLower, 'salute')) {
            return 'salute';
        }

        // Default: alimentari
        return 'alimentari';
    }
}
