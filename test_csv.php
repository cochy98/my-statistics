<?php

// Script di test per verificare il parsing del CSV
$csvFile = '/Users/cosmo/Documents/testing/my-statistics/storage/app/spese.csv';

if (!file_exists($csvFile)) {
    echo "File CSV non trovato: $csvFile\n";
    exit(1);
}

echo "=== Test Parsing CSV ===\n";

$csvData = array_map(function($line) {
    return str_getcsv($line, ';'); // Usa il punto e virgola come separatore
}, file($csvFile));

$header = array_shift($csvData);
echo "Header: " . implode(' | ', $header) . "\n";
echo "Numero colonne header: " . count($header) . "\n";
echo "Numero righe dati: " . count($csvData) . "\n\n";

echo "=== Prime 3 righe ===\n";
foreach (array_slice($csvData, 0, 3) as $index => $row) {
    echo "Riga " . ($index + 1) . ": " . implode(' | ', $row) . "\n";
    echo "Numero colonne: " . count($row) . "\n";
    
    if (count($row) >= 5) {
        $amount = floatval(str_replace(',', '.', trim($row[4])));
        echo "Importo parsato: $amount\n";
    }
    echo "\n";
}

echo "=== Test completato ===\n";
