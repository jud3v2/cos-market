<?php

namespace Database\Seeders;

use App\Models\Agents;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class AgentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = Http::get('https://bymykel.github.io/CSGO-API/api/en/agents.json')->json();

        foreach($data as $a) {
            if(Agents::where('cs_go_id', $a['id'])->first()) {
                continue;
            }
            if(Agents::where('name', $a['name'])->first()) {
                continue;
            }

            Agents::create([
                'cs_go_id' => $a['id'],
                'name' => $a['name'],
                'description' => $a['description'],
                'image' => $a['image'],
                'rarity' => json_encode($a['rarity'] ?? []),
                'collections' => json_encode($a['collections'] ?? []),
                'team' => json_encode($a['team'] ?? []),
                'market_hash_name' => $a['market_hash_name'] ?? '',
            ]);
        }
    }
}
