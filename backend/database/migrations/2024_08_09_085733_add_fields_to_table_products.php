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
        Schema::table('product', function (Blueprint $table) {
            $table->unsignedBigInteger('in_user_id_cart')->nullable();
            $table->foreign('in_user_id_cart')->references('id')->on('users');
            $table->dateTime('blocked_at')->nullable();
            $table->dateTime('unblocked_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product', function (Blueprint $table) {
            $table->dropForeign('in_user_id_cart');
            $table->dropColumn('in_user_id_cart');
            $table->dropColumn('blocked_at');
            $table->dropColumn('unblocked_at');
        });
    }
};
