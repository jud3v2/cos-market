<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BulletCoinTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'description',
        'status',
        'transaction_id',
        'bullet_coin_id'
    ];

    public function registerTransation(array $data): bool {
        $bt = new $this;
        $bt->user_id = $data['user_id'];
        $bt->amount = $data['amount'];
        $bt->description = $data['description'];
        $bt->status = $data['status'];
        $bt->transaction_id = $data['transaction_id'];
        $bt->type = $data['type'];
        $bt->bullet_coin_id = $data['bullet_coin_id'];
        return $bt->save();
    }
}
