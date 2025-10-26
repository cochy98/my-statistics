<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Alimentari',
                'slug' => 'alimentari',
                'color' => '#4CAF50',
                'icon' => 'shopping-cart',
                'description' => 'Spese per cibo e bevande'
            ],
            [
                'name' => 'Salute',
                'slug' => 'salute',
                'color' => '#F44336',
                'icon' => 'heart',
                'description' => 'Spese mediche e farmaceutiche'
            ],
            [
                'name' => 'Bellezza',
                'slug' => 'bellezza',
                'color' => '#E91E63',
                'icon' => 'sparkles',
                'description' => 'Prodotti per la cura personale'
            ],
            [
                'name' => 'Casa',
                'slug' => 'casa',
                'color' => '#9C27B0',
                'icon' => 'home',
                'description' => 'Prodotti per la casa e pulizia'
            ],
            [
                'name' => 'Svago',
                'slug' => 'svago',
                'color' => '#FF9800',
                'icon' => 'gamepad-2',
                'description' => 'Intrattenimento e tempo libero'
            ],
            [
                'name' => 'Trasporti',
                'slug' => 'trasporti',
                'color' => '#2196F3',
                'icon' => 'car',
                'description' => 'Spese per trasporti e veicoli'
            ],
            [
                'name' => 'Altro',
                'slug' => 'altro',
                'color' => '#607D8B',
                'icon' => 'more-horizontal',
                'description' => 'Altre spese non categorizzate'
            ]
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
