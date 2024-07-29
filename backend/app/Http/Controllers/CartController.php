<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Cart;
use App\Models\Product;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if(!isset($_GET['steam_id'])) {
            return response()->json([
                'success' => false,
                'message' => 'Steam ID not found',
                'errorCode' => 400
            ],400);
        }

        $cart = new Cart($_GET['steam_id']);
        return response()->json($cart->getCart());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $cart = new Cart($_GET['steam_id']);
        if($cart->save()) {
            return response()->json([
                'success' => true,
                'message' => 'Cart saved to DB',
                'cart' => $cart->getCart()
            ]);
        } else {

            return response()->json([
                'success' => false,
                'message' => 'Cart not saved to DB',
                'errorCode' => 400
            ],400);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $cart = new Cart($request->get('steam_id'));
        $product = Product::find($request->get('product_id'));

        if(!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
                'errorCode' => 400
            ],400);
        }
        $added = $cart->addProduct($product, false);
        $cart->save();

        $message = (bool) $request->get('flag') === false ? 'Product added to cart' : 'Product removed from cart';
        return response()->json([
            'success' => true,
            'message' => $added ? $message : 'Product already in cart',
            'cart' => $cart->getCart()
        ],$added ? 200 : 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $cart = new Cart($_GET['steam_id']);
        $cart->emptyCart();
        $cart->save();

        return response()->json([
            'success' => true,
            'message' => 'Cart emptied',
            'cart' => $cart->getCart()
        ],200);
    }
}
