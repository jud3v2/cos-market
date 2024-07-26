<?php

namespace Database\Seeders;

use App\Models\Skin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class SkinSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = Http::get('https://bymykel.github.io/CSGO-API/api/en/skins.json')->json();

        foreach ($data as $skin) {



            if(isset($skin['souvenir'])) {
                $skin['souvenir'] = (boolean) $skin['souvenir'];
            } else {
                $skin['souvenir'] = false;
            }

            if(isset($skin['stattrak'])) {
                $skin['stattrak'] = (boolean) $skin['stattrak'];
            } else {
                $skin['stattrak'] = false;
            }

            if(isset($skin['wears'])) {
                $skin['wears'] = json_encode($skin['wears']);
            } else {
                $skin['wears'] = json_encode([]);
            }

            if(isset($skin['collections'])) {
                $skin['collections'] = json_encode($skin['collections']);
            } else {
                $skin['collections'] = json_encode([]);
            }

            if(isset($skin['crates'])) {
                $skin['crates'] = json_encode($skin['crates']);
            } else {
                $skin['crates'] = json_encode([]);
            }

            if(isset($skin['team'])) {
                $skin['team'] = json_encode($skin['team']);
            } else {
                $skin['team'] = json_encode([]);
            }

            if(isset($skin['image'])) {
                $skin['image'] = $skin['image'];
            } else {
                $skin['image'] = '';
            }

            if(Skin::where('name', $skin['name'])->exists()) {
                continue;
            }

            Skin::create([
                'name' => $skin['name'],
                'description' => $skin['description'] ?? '',
                'weapons' => json_encode($skin['weapon']) ?? json_encode([]),
                'category' => json_encode($skin['category']) ?? json_encode([]),
                'pattern' => json_encode($skin['pattern']) ?? json_encode([]),
                'min_float' => $skin['min_float'] ?? 0.00,
                'max_float' => $skin['max_float'] ?? 0.00,
                'rarity' => json_encode($skin['rarity']) ?? json_encode([]),
                'stattrak' => $skin['stattrak'],
                'souvenir' => $skin['souvenir'],
                'paint_index' => $skin['paint_index'] ?? 0,
                'wears' => json_encode($skin['wears']) ?? json_encode([]),
                'collections' => json_encode($skin['collections']) ?? json_encode([]),
                'crates' => json_encode($skin['crates']) ?? json_encode([]),
                'team' => json_encode($skin['team']) ?? json_encode([]),
                'image' => $skin['image'] ?? '',
                'cs_go_id' => $skin['id']
            ]);
        }
    }
}
