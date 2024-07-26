<?php

namespace Database\Seeders;

use App\Models\Stickers;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class StickersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = Http::get('https://bymykel.github.io/CSGO-API/api/en/stickers.json')->json();

        foreach ($data as $sticker) {
            if(Stickers::where('cs_go_id', $sticker['id'])->exists()) continue;
            if(Stickers::where('name', $sticker['name'])->exists()) continue;

            Stickers::create([
                'cs_go_id' => $sticker['id'],
                'name' => $sticker['name'],
                'description' => $sticker['description'] ?? null,
                'image' => $sticker['image'] ?? '',
                'rarity' => json_encode($sticker['rarity']) ?? json_encode([]),
                'crates' => json_encode($sticker['crates']) ?? json_encode([]),
                'tournament_event' => $sticker['tournament_event'] ?? '',
                'tournament_team' => $sticker['tournament_team'] ?? '',
                'type' => $sticker['type'] ?? '',
                'market_hash_name' => $sticker['market_hash_name'] ?? '',
                'effect' => $sticker['effect'] ?? '',
            ]);
        }
    }
}
