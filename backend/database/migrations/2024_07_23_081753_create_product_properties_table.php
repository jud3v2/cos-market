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
        Schema::create('product_properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId("product_id")->constrained("product")->onDelete("cascade");
            $table->float("weight")->comment("Weight of the product properties");
            $table->float("height")->comment("Height of the product properties");
            $table->float("width")->comment("Width of the product properties");
            $table->integer("quantity")->comment('Quantity of the product properties ex: 100 of size M with color red');
            $table->boolean("isActive")->default(false)->comment('Is this product properties active');
            $table->boolean("isDefault")->default(false)->comment('Is this the default product properties');
            $table->string("slug")->unique()->comment('Slug of the product properties');
            $table->string("name")->comment('Name of the product properties');
            $table->string("color")->comment('Color of the product properties')->nullable();
            $table->string("size")->comment('Size of the product properties')->nullable();
            $table->text("description")->comment('Description of the product properties');
            $table->string("sku")->unique()->comment("Stock Keeping Unit")->nullable();
            $table->float("price_modification")->comment("Price modification in float");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_properties');
    }
};
