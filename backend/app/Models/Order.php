<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'payment_method',
        'payment_id',
        'total_price',
        'total_price_with_tax',
        'tax',
        'client_address'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
