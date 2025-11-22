<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\StoreLocation;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stores = [
            [
                'name' => 'Esselunga',
                'type' => 'supermarket',
                'description' => 'Supermercato',
                'locations' => [
                    [
                        'name' => 'Centro',
                        'address' => 'Via Roma, 15',
                        'city' => 'Milano',
                        'province' => 'MI',
                        'postal_code' => '20121',
                        'phone' => '02 1234567',
                        'is_default' => true,
                    ],
                    [
                        'name' => 'Periferia Nord',
                        'address' => 'Viale Monza, 200',
                        'city' => 'Milano',
                        'province' => 'MI',
                        'postal_code' => '20125',
                        'phone' => '02 7654321',
                        'is_default' => false,
                    ],
                ],
            ],
            [
                'name' => 'Coop',
                'type' => 'supermarket',
                'description' => 'Supermercato',
                'locations' => [
                    [
                        'name' => 'Sede Principale',
                        'address' => 'Corso Garibaldi, 45',
                        'city' => 'Milano',
                        'province' => 'MI',
                        'postal_code' => '20121',
                        'phone' => '02 2345678',
                        'is_default' => true,
                    ],
                    [
                        'name' => 'Filiale Sud',
                        'address' => 'Via Larga, 12',
                        'city' => 'Milano',
                        'province' => 'MI',
                        'postal_code' => '20122',
                        'phone' => '02 3456789',
                        'is_default' => false,
                    ],
                ],
            ],
            [
                'name' => 'Carrefour',
                'type' => 'supermarket',
                'description' => 'Ipermercato',
                'locations' => [
                    [
                        'name' => 'Ipermercato',
                        'address' => 'Via XX Settembre, 30',
                        'city' => 'Roma',
                        'province' => 'RM',
                        'postal_code' => '00187',
                        'phone' => '06 4567890',
                        'is_default' => true,
                    ],
                ],
            ],
            [
                'name' => 'Farmacia Comunale',
                'type' => 'pharmacy',
                'description' => 'Farmacia',
                'locations' => [
                    [
                        'name' => 'Centro',
                        'address' => 'Piazza Duomo, 8',
                        'city' => 'Milano',
                        'province' => 'MI',
                        'postal_code' => '20121',
                        'phone' => '02 5678901',
                        'is_default' => true,
                    ],
                ],
            ],
            [
                'name' => 'Farmacia San Marco',
                'type' => 'pharmacy',
                'description' => 'Farmacia',
                'locations' => [
                    [
                        'name' => 'Sede Unica',
                        'address' => 'Via San Marco, 22',
                        'city' => 'Milano',
                        'province' => 'MI',
                        'postal_code' => '20121',
                        'phone' => '02 6789012',
                        'is_default' => true,
                    ],
                ],
            ],
            [
                'name' => 'Tigre',
                'type' => 'hardware',
                'description' => 'Fai da te e bricolage',
                'locations' => [
                    [
                        'name' => 'Milano Nord',
                        'address' => 'Via Bicocca, 100',
                        'city' => 'Milano',
                        'province' => 'MI',
                        'postal_code' => '20126',
                        'phone' => '02 7890123',
                        'is_default' => true,
                    ],
                    [
                        'name' => 'Milano Sud',
                        'address' => 'Via Ripamonti, 200',
                        'city' => 'Milano',
                        'province' => 'MI',
                        'postal_code' => '20139',
                        'phone' => '02 8901234',
                        'is_default' => false,
                    ],
                ],
            ],
            [
                'name' => 'Leroy Merlin',
                'type' => 'hardware',
                'description' => 'Bricolage e giardinaggio',
                'locations' => [
                    [
                        'name' => 'Sede Principale',
                        'address' => 'Via della Magliana, 500',
                        'city' => 'Roma',
                        'province' => 'RM',
                        'postal_code' => '00148',
                        'phone' => '06 9012345',
                        'is_default' => true,
                    ],
                ],
            ],
            [
                'name' => 'IKEA',
                'type' => 'furniture',
                'description' => 'Mobili e arredamento',
                'locations' => [
                    [
                        'name' => 'Milano',
                        'address' => 'Via Monza, 1',
                        'city' => 'Sesto San Giovanni',
                        'province' => 'MI',
                        'postal_code' => '20099',
                        'phone' => '02 0123456',
                        'is_default' => true,
                    ],
                    [
                        'name' => 'Roma',
                        'address' => 'Via Pomezia, 200',
                        'city' => 'Roma',
                        'province' => 'RM',
                        'postal_code' => '00178',
                        'phone' => '06 1234567',
                        'is_default' => false,
                    ],
                ],
            ],
            [
                'name' => 'Unieuro',
                'type' => 'electronics',
                'description' => 'Elettronica e informatica',
                'locations' => [
                    [
                        'name' => 'Centro',
                        'address' => 'Corso Buenos Aires, 50',
                        'city' => 'Milano',
                        'province' => 'MI',
                        'postal_code' => '20124',
                        'phone' => '02 2345678',
                        'is_default' => true,
                    ],
                ],
            ],
            [
                'name' => 'MediaWorld',
                'type' => 'electronics',
                'description' => 'Elettronica e tecnologia',
                'locations' => [
                    [
                        'name' => 'Milano Centro',
                        'address' => 'Via Torino, 15',
                        'city' => 'Milano',
                        'province' => 'MI',
                        'postal_code' => '20123',
                        'phone' => '02 3456789',
                        'is_default' => true,
                    ],
                    [
                        'name' => 'Milano Porta Garibaldi',
                        'address' => 'Corso Garibaldi, 100',
                        'city' => 'Milano',
                        'province' => 'MI',
                        'postal_code' => '20121',
                        'phone' => '02 4567890',
                        'is_default' => false,
                    ],
                ],
            ],
            [
                'name' => 'Conad',
                'type' => 'supermarket',
                'description' => 'Supermercato',
                'locations' => [
                    [
                        'name' => 'Sede Unica',
                        'address' => 'Via Verdi, 30',
                        'city' => 'Torino',
                        'province' => 'TO',
                        'postal_code' => '10121',
                        'phone' => '011 5678901',
                        'is_default' => true,
                    ],
                ],
            ],
            [
                'name' => 'Lidl',
                'type' => 'supermarket',
                'description' => 'Supermercato discount',
                'locations' => [
                    [
                        'name' => 'Filiale 1',
                        'address' => 'Via Nazionale, 200',
                        'city' => 'Roma',
                        'province' => 'RM',
                        'postal_code' => '00184',
                        'phone' => '06 6789012',
                        'is_default' => true,
                    ],
                    [
                        'name' => 'Filiale 2',
                        'address' => 'Via Appia Nuova, 500',
                        'city' => 'Roma',
                        'province' => 'RM',
                        'postal_code' => '00183',
                        'phone' => '06 7890123',
                        'is_default' => false,
                    ],
                ],
            ],
        ];

        foreach ($stores as $storeData) {
            $locations = $storeData['locations'];
            unset($storeData['locations']);

            $store = Store::firstOrCreate(
                ['name' => $storeData['name']],
                $storeData
            );

            foreach ($locations as $locationData) {
                StoreLocation::firstOrCreate(
                    [
                        'store_id' => $store->id,
                        'address' => $locationData['address'],
                        'city' => $locationData['city'],
                    ],
                    $locationData
                );
            }
        }
    }
}

