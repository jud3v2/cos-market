<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stickers extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'image',
        'rarity',
        'type',
        'collection',
        'description',
        'release_date',
        'price',
        'is_available',
    ];
}
