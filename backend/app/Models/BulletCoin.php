<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BulletCoin extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'amount',
        'game_attempts',
        'game_reset_attempts_date'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
