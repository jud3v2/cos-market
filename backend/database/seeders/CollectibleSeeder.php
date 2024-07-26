<?php

namespace Database\Seeders;

use App\Models\Collectible;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class CollectibleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = Http::get("https://bymykel.github.io/CSGO-API/api/en/collectibles.json")->json();

        foreach ($data as $c) {
            if(Collectible::where('cs_go_id', $c['id'])->exists()) continue;
            if(Collectible::where('name', $c['name'])->exists()) continue;
            Collectible::create([
                'cs_go_id' => $c['id'],
                'name' => $c['name'],
                "description" => $c['description'],
                "image" => $c['image'],
                "rarity" => json_encode($c['rarity']),
                "type" => $c['type'] ?? '',
                "market_hash_name" => $c['market_hash_name'] ?? '',
                "genuine" => $c['genuine'],
            ]);
        }
    }
}
