<?php

namespace Database\Seeders;

use App\Models\Patches;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class PatchesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = Http::get('https://bymykel.github.io/CSGO-API/api/en/patches.json')->json();

        foreach ($data as $patch) {
            if(Patches::where('cs_go_id', $patch['id'])->exists()) continue;
            if(Patches::where('name', $patch['name'])->exists()) continue;

            Patches::create([
               'name' => $patch['name'] ?? '',
               'cs_go_id' => $patch['id'] ?? 0,
               "description" => $patch['description'] ?? '',
               'rarity' => json_encode($patch['rarity'] ?? []),
               'market_hash_name' => $patch['market_hash_name'] ?? '',
                'image' => $patch['image'] ?? '',
            ]);
        }
    }
}
