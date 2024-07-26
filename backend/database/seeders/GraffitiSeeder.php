<?php

namespace Database\Seeders;

use App\Models\Graffiti;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class GraffitiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = Http::get('https://bymykel.github.io/CSGO-API/api/en/graffiti.json')->json();

        foreach ($data as $graffiti) {
            if(Graffiti::where('name', $graffiti['name'])->exists()) {
                continue;
            }

            if(Graffiti::where('cs_go_id', $graffiti['id'])->exists()) {
                continue;
            }

            Graffiti::create([
                'cs_go_id' => $graffiti['id'],
                'name' => $graffiti['name'],
                'image' => $graffiti['image'] ?? "",
                'description' => $graffiti['description'] ?? "",
                'rarity' => json_encode($graffiti['rarity'] ?? []),
                'crates' => json_encode($graffiti['crates'] ?? []),
                'market_hash_name' => $graffiti['market_hash_name'] ?? '',
            ]);
        }
    }
}
