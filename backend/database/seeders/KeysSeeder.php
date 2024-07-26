<?php

namespace Database\Seeders;

use App\Models\Keys;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class KeysSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = Http::get("https://bymykel.github.io/CSGO-API/api/en/keys.json")->json();

        foreach ($data as $key) {

            // Check if the key already exists in the database
            if(Keys::where('name', $key['name'])->exists()) {
                continue;
            }

            Keys::create([
                'cs_go_id' => $key['id'],
                'name' => $key['name'],
                'image' => $key['image'],
                "description"  => $key['description'],
                "market_hash_name" => $key['market_hash_name'],
                "crates" => json_encode($key['crates']),
            ]);
        }
    }
}
