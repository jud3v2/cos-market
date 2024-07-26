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
        Schema::create('crates', function (Blueprint $table) {
            $table->id();
            $table->string('cs_go_id')->unique();
            $table->string('name')->unique();
            $table->longtext('description')->nullable();
            $table->longtext('image');
            $table->json('contains');
            $table->json('contains_rare');
            $table->date('first_sale_date');
            $table->string('type');
            $table->string('market_hash_name');
            $table->boolean('rental');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crates');
    }
};
