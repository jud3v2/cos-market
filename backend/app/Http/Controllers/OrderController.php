<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderedProduct;
use App\Models\Product;
use App\Models\User;
use App\Services\Cart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(['order' => Order::all()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required',
        ]);

        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $products = (new Cart($user->steam_id))->getProducts();
        $request->status = 'pending';
        $request->total_price = 0;
        $request->total_price_with_tax = 0;

        // check availability of a product and calculate the total price of the order
        foreach ($products as $product) {
            $blockedAt = Carbon::parse($product->blocked_at);
            $unblockTime = $blockedAt->addMinutes(15);

            // Vérifier si le produit a déjà été commandé par l'utilisateur.
            if (OrderedProduct::where('product_id', $product->id)->exists()) {
                (new Cart($user->steam_id))->fillOutCart();
                return response()->json(['error' => 'Product already ordered'], 400);
            }

            // Vérifier si le produit est déjà dans le panier d'un autre utilisateur.
            if ($product->in_user_id_cart != $user->id && $product->in_user_id_cart != null) {
                return response()->json(['error' => 'Product not in user cart'], 400);
            }


            // si sa fait moins de 15 minute le produit est bloqué.
            if (($product->blocked_at !== null && Carbon::parse($product->blocked_at)->diffInMinutes() < 15) && $product->in_user_id_cart != $user->id) {
                return response()->json(['error' => 'Product blocked'], 400);
            }

            //Si aucune personne n'a commandé ce produit
            // Cette condition permettra de bloquer le produit pour la personne qui le commande
            // Pour une durée de 15 minutes
            if($product->blocked_at === null && $product->in_user_id_cart === null) {
                Product::where('id', $product->id)->update(['in_user_id_cart' => $user->id, 'blocked_at' => Carbon::now()]);

                $request->total_price += $product->price;
                $request->total_price_with_tax += $product->price * 1.2; // 20% de taxe
            }

            if ($product->blocked_at !== null && Carbon::parse($product->blocked_at)->diffInMinutes() > 15) {
                Product::where('id', $product->id)->update(['in_user_id_cart' => $user->id, 'blocked_at' => Carbon::now()]);

                $request->total_price += $product->price;
                $request->total_price_with_tax += $product->price * 1.2; // 20% de taxe
            }
        }

        // ensure we have a minimum of 1 product in the cart to create an order
        if ($request->total_price === 0) {
            return response()->json(['error' => 'No product in the cart'], 404);
        }

        // création de la commande
        $order = new Order();
        $order->total_price = $request->total_price;
        $order->total_price_with_tax = $request->total_price_with_tax;
        $order->user_id = $user->id;
        $order->save();

        // si la commande n'a pas été créer on vas retourner une erreur
        if (!$order) {
            return response()->json(['error' => 'Order not created'], 500);
        }

        // création des produits commandés
        foreach ($products as $product) {
            $orderedProduct = OrderedProduct::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
            ]);

        }

        // vider le panier
        (new Cart($user->steam_id))->emptyCart();

        // renvoie de la réponse json pour le client, afin de lui notifier que sa commande a bien été créée
        return response()->json([
            'message' => 'Order created',
            'success' => true,
            'order' => $order,
            'numberOfProduct' => count($products),
            "products" => $products,
            'user_id' => $user->id,
            'steam_id' => $user->steam_id
        ], 201);
    }

        /**
         * Display the specified resource.
         */
        public
        function show(Order $order): JsonResponse
        {
            return response()->json(['order' => $order]);
        }

        /**
         * Update the specified resource in storage.
         */
        public
        function update(Request $request, Order $order): JsonResponse
        {
            $request->validate([
                'user_id' => 'required',
                'total_price_with_tax' => 'required',
                'total_price' => 'required',
                'status' => 'required',
                'tax' => 'required',
            ]);

            $order->update($request->all());

            return response()->json($order, 200);
        }

        /**
         * Remove the specified resource from storage.
         */
        public
        function destroy(Order $order): JsonResponse
        {
            return response()->json(['order' => $order->delete()], 204);
        }

        public function getOrders(Request $request): JsonResponse
        {

        }
    }
