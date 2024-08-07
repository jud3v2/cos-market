<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bullet_coins', function (Blueprint $table) {
            $table->unsignedInteger("game_attempts")->default(0)->after("amount");
            $table->timestamp('game_reset_attempts_date')->nullable()->default(null)->after("game_attempts");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bullet_coins', function (Blueprint $table) {
            $table->dropColumn(['game_attempts', 'game_reset_attempts_date']);
        });
    }
};
