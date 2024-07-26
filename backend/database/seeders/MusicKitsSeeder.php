<?php

namespace Database\Seeders;

use App\Models\MusicKits;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class MusicKitsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = Http::get('https://bymykel.github.io/CSGO-API/api/en/music_kits.json')->json();

        foreach ($data as $musicKit) {
            if(MusicKits::where('name', $musicKit['name'])->exists()) continue;
            if(MusicKits::where('cs_go_id', $musicKit['id'])->exists()) continue;

            MusicKits::create([
                'cs_go_id' => $musicKit['id'],
                'name' => $musicKit['name'],
                'description' => $musicKit['description'] ?? null,
                'image' => $musicKit['image'] ?? '',
                'rarity' => json_encode($musicKit['rarity']) ?? json_encode([]),
                'market_hash_name' => $musicKit['market_hash_name'] ?? '',
                'exclusive' => $musicKit['exclusive'] ?? false,
            ]);
        }
    }
}
