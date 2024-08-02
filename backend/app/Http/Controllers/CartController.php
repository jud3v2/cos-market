<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\Cart;
use App\Models\Product;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        if(!isset($_GET['steam_id'])) {
            return response()->json([
                'success' => false,
                'message' => 'Steam ID not found',
                'errorCode' => 400
            ],400);
        }

        $cart = new Cart($_GET['steam_id'] ?? $steamId);
       if(isset($_GET['steam_id'])) {
        return response()->json([
            'success' => true,
            'cart' => $cart->getCart(),
            'total' => $cart->getTotalPrice()
        ]); }

        return [
            'success' => true,
            'cart' => $cart->getCart(),
            'total' => $cart->getTotalPrice()
        ];

    }

    /**
     * Store a newly created resource in storage.
     */
public function store(Request $request): JsonResponse
{
    try {
        $cart = new Cart($request->get('steam_id'));
        if ($cart->save()) {
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
            ], 400);
        }
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'An error occurred: ' . $e->getMessage(),
            'errorCode' => 500
        ], 500);
    }
}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request): JsonResponse
    {
        $cart = new Cart($request->get('steam_id'));
        $product = Product::find($request->get('product_id'));
        $steamId = $request->get('steam_id');

        if(!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
                'errorCode' => 400
            ],400);
        }
        $added = $cart->addProduct($product);
        $cart->save();

        $message = (bool) $request->get('flag') === false ? 'Product added to cart' : 'Product removed from cart';

        return response()->json([
            'success' => $added,
            'message' => $added ? $message : 'Product already in cart',
            'total' => $cart->getTotalPrice()
        ],$added ? 200 : 400);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function remove(): JsonResponse
    {
        if(!isset($_GET['steam_id'])) {
            return response()->json([
                'success' => false,
                'message' => 'Steam ID not found',
                'errorCode' => 400
            ],400);
        }

        $cart = new Cart($_GET['steam_id']);
        $product = Product::find($_GET['product_id']);

        if($cart->removeProduct($product)){
            $cart->save();
            return response()->json([
                'success' => true,
                'message' => 'Product removed from cart',
                'cart' => $cart->getCart(),
                'total' => $cart->getTotalPrice()
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Product not found in cart',
                'errorCode' => 400
            ],400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(): JsonResponse
    {
        $cart = new Cart($_GET['steam_id']);
        $cart->emptyCart();
        $cart->save();

        return response()->json([
            'success' => true,
            'message' => 'Cart empty',
            'cart' => $cart->getCart()
        ]);
    }
}
