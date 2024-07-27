<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'product';
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'isActive',
        'type',
        'item_id',
        "stock"
    ];
}
