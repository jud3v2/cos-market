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
        Schema::create('stickers', function (Blueprint $table) {
            $table->id();
            $table->string('cs_go_id')->unique();
            $table->string('name')->unique();
            $table->longtext('description')->nullable();
            $table->longtext('image');
            $table->json('rarity');
            $table->json('crates');
            $table->string('tournament_event');
            $table->string('tournament_team');
            $table->string('type');
            $table->string('market_hash_name');
            $table->string('effect');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stickers');
    }
};
