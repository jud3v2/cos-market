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
        //cs go skins
        Schema::create('skins', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->longText('description');
            $table->json('weapons');
            $table->json('category');
            $table->json('pattern');
            $table->float('min_float');
            $table->float('max_float');
            $table->json('rarity');
            $table->boolean('stattrak');
            $table->boolean('souvenir');
            $table->string('paint_index');
            $table->json('wears');
            $table->json('collections');
            $table->json('crates');
            $table->json('team');
            $table->longText('image');
            $table->string('cs_go_id')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skins');
    }
};
