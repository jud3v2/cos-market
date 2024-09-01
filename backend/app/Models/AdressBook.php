<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdressBook extends Model
{
    use HasFactory;
    protected $table = 'adress_books';

    protected $fillable = [
        'user_id',
        'name',
        'address',
        'city',
        'zipcode',
        'country',
        'isDefault'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
