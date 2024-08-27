<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

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

    public function products(): HasManyThrough
    {
        return $this->hasManyThrough(Product::class, OrderedProduct::class, 'order_id', 'id', 'id', 'product_id');
    }

    public function getPaidProducts()
    {
        return $this->products()->where('is_paid', true);
    }
}
