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
        // Add steam_id field to users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('steam_id')->nullable()->unique()->after('email');
            $table->string('avatar')->nullable()->after('steam_id');
            $table->string('profile_url')->nullable()->after('avatar');
            $table->string('profile_name')->nullable()->after('profile_url');
            $table->string('profile_country')->nullable()->after('profile_name');
            $table->string('profile_state')->nullable()->after('profile_country');
            $table->string('profile_city')->nullable()->after('profile_state');
            $table->string('profile_street')->nullable()->after('profile_city');
            $table->string('profile_zip')->nullable()->after('profile_street');
            $table->string('profile_phone')->nullable()->after('profile_zip');
            $table->string('profile_mobile')->nullable()->after('profile_phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $table->dropColumn('steam_id');
        $table->dropColumn('avatar');
        $table->dropColumn('profile_url');
        $table->dropColumn('profile_name');
        $table->dropColumn('profile_country');
        $table->dropColumn('profile_state');
        $table->dropColumn('profile_city');
        $table->dropColumn('profile_street');
        $table->dropColumn('profile_zip');
        $table->dropColumn('profile_phone');
        $table->dropColumn('profile_mobile');
    }
};
