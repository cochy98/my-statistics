<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\FuelLog;
use Illuminate\Support\Facades\DB;
use League\Csv\Reader;

class FuelLogSeeder extends Seeder
{
    public function run()
    {
        // Crea utente e veicolo di test
        $user = User::firstOrCreate(['email' => 'cosmoferrigno@gmail.com'], ['name' => 'Cosmo Ferrigno', 'password' => bcrypt('password')]);
        $vehicle = Vehicle::firstOrCreate(['user_id' => $user->id, 'model' => 'VW Polo 4']);

        // Path al file CSV
        $csvPath = storage_path('app/fuel_data.csv');

        // Usa League\Csv (installabile con composer require league/csv)
        $csv = Reader::createFromPath($csvPath, 'r');
        $csv->setHeaderOffset(0); // prima riga come intestazione

        foreach ($csv as $record) {
            // Parsing sicuro
            $date = $this->parseDate($record['Data']);
            if (!$date) continue;

            FuelLog::create([
                'vehicle_id' => $vehicle->id,
                'date' => $date,
                'amount' => $this->toNullableFloat($record['Importo (â¬)']),
                'liters' => $this->toNullableFloat($record['Litri']),
                'price_per_liter' => $this->toNullableFloat($record['Prezzo al litro (â¬)']),
                'km_travelled' => $this->toNullableFloat($record['KM percorsi']),
            ]);
        }
    }

    private function parseDate($value)
    {
        $formats = ['d-m', 'd-m-Y', 'd-m-y'];
        foreach ($formats as $format) {
            $parsed = \DateTime::createFromFormat($format, $value);
            if ($parsed !== false) {
                // Assume anno corrente se mancante
                $year = $parsed->format('Y') == '1970' ? now()->year : $parsed->format('Y');
                return $parsed->setDate($year, $parsed->format('m'), $parsed->format('d'))->format('Y-m-d');
            }
        }
        return null;
    }

    private function toNullableFloat($value)
    {
        $clean = trim(str_replace(',', '.', $value));
        return is_numeric($clean) ? (float)$clean : null;
    }
}
