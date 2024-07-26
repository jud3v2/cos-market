<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skin extends Model
{

    protected $fillable = [
        'name',
        'description',
        'weapons',
        'category',
        'pattern',
        'min_float',
        'max_float',
        'rarity',
        'stattrak',
        'souvenir',
        'wears',
        'team',
    ];

    use HasFactory;
}
