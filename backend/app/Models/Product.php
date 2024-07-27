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

    public function getRelatedItem()
    {
        if($this->type === 'skin') {
            return $this->hasOne(Skin::class, 'id', 'item_id');
        } elseif($this->type === "sticker") {
            return $this->hasOne(Stickers::class, 'id', 'item_id');
        } elseif($this->type === "music-kit") {
            return $this->hasOne(MusicKits::class, 'id', 'item_id');
        } elseif($this->type === "graffiti") {
            return $this->hasOne(Graffiti::class, 'id', 'item_id');
        } elseif($this->type === "patch") {
            return $this->hasOne(Patches::class, 'id', 'item_id');
        } elseif($this->type === "collectible") {
            return $this->hasOne(Collectible::class, 'id', 'item_id');
        } elseif($this->type === "key") {
            return $this->hasOne(Keys::class, 'id', 'item_id');
        } elseif($this->type === "crate") {
            return $this->hasOne(Crates::class, 'id', 'item_id');
        }

        return null;
    }
}
