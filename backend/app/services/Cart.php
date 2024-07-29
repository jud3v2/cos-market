<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Cart as CartModel;
use Illuminate\Support\Facades\DB;

class Cart
{

    private CartModel|array $cart;
    private Product|array $products;
    private string $steamId;

    public function __construct(string $steamId)
    {
        $this->cart = CartModel::where('steam_id', $steamId)->first() ?? [];
        $this->products = json_decode($this->cart->products ?? '[]');
        $this->steamId = $steamId;
    }

    public function getCart(): CartModel|array|self
    {
        return $this->cart;
    }

    /**
     * @param \App\Models\Product $product
     * @param bool $flag
     * @return bool | array
     */
    public function addProduct(Product $product, bool $flag = false): bool|array
    {
        if (count($this->products) > 0) {
            foreach ($this->products as $key => $p) {
                if ($p->id === $product->id) {
                    return false;
                }
            }
        }

        $this->products[] = $product;
        return true;
    }

    public function removeProduct(Product $product): bool
    {
        foreach ($this->products as $key => $p) {
            if ($p->id === $product->id) {
                unset($this->products[$key]);
                return true;
            }
        }
        return false;
    }

    public function emptyCart(): void
    {
        $this->products = [];
    }

    public function save(): bool
    {
        if ($c = CartModel::where('steam_id', $this->steamId)->first()) {
            $c->products = json_encode($this->products);
            return (bool)$c->save();
        } else {
            $c = new CartModel();
            $c->steam_id = $this->steamId;
            $c->products = json_encode($this->products);
            return $c->save();
        }
    }

    public function getTotalPrice(): float
    {
        $total = 0;
        foreach ($this->products as $product) {
            $total += $product->price;
        }

        return $total;
    }
}
