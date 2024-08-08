<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SeedEveryThings extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $seeders = glob('database/seeders/*.php', GLOB_NOSORT);
        foreach ($seeders as $seeder) {
            if ($seeder !== 'database/seeders/SeedEveryThings.php') {
                $seeder = str_replace('database/seeders/', '', $seeder);
                $seeder = str_replace('.php', '', $seeder);
                $this->call("Database\Seeders\\$seeder");
            }
        }
    }
}
