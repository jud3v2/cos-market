<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'steam_id',
        'avatar',
        'profile_url',
        'profile_name',
        'profile_country',
        'profile_state',
        'profile_city',
        'profile_street',
        'profile_zip',
        'profile_phone',
        'profile_mobile',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'user' => [
                'name' => $this->name,
                'email' => $this->email,
                'avatar' => $this->avatar,
                'steam_id' => $this->steam_id,
                'id' => $this->id,
            ]
        ];
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function inventory(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function cart(): HasOne
    {
        return $this->hasOne(Cart::class);
    }

    public function bulletCoin(): HasOne
    {
        return $this->hasOne(BulletCoin::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function adresses(): HasMany
    {
        return $this->hasMany(AdressBook::class);
    }

    public function getAdressDefault(): AdressBook
    {
        return $this->adresses()->where('isDefault', true)->first();
    }
}
