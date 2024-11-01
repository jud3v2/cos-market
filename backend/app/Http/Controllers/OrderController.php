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
use Log;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(['order' => Order::with('products')->get()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required',
            'address_id' => 'required',
            'bcreduction' => 'nullable'
        ]);

        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if($request->bcreduction) {
            // check balance of user in bulletCoin table if the request bc is greater than balance use only the balance
            $balance = $user->bulletCoin->amount;

            if($request->bcreduction > $balance) {
                $request->bcreduction = $balance;
            }
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
                return response()->json(['error' => 'Product already ordered', 'product' => $product], 400);
            }

            // Vérifier si le produit est déjà dans le panier d'un autre utilisateur.
            if ($product->in_user_id_cart != $user->id && $product->in_user_id_cart != null) {
                return response()->json(['error' => 'Product not in user cart', 'product' => $product], 400);
            }


            // si sa fait moins de 15 minute le produit est bloqué.
            if (($product->blocked_at !== null && Carbon::parse($product->blocked_at)->diffInMinutes() < 15) && $product->in_user_id_cart != $user->id) {
                return response()->json(['error' => 'Product blocked', 'product' => $product], 400);
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
            return response()->json(['error' => 'Votre panier ne dispose de plus aucun produit'], 404);
        }

        // if bcreduction is greater than 0, we will use it to reduce the total price by 0.01%
        if($request->bcreduction > 0) {
            $bulletCoinValue = 0.0001; // 0.01%
            $reduction = $request->total_price_with_tax * ($bulletCoinValue * $request->bcreduction);
            $request->total_price_with_tax -= $reduction;
        }

        // création de la commande
        $order = new Order();
        $order->total_price = $request->total_price;
        $order->total_price_with_tax = $request->total_price_with_tax;
        $order->user_id = $user->id;
        $order->client_address = $request->address_id;
        $order->save();

        // si la commande n'a pas été créer on vas retourner une erreur
        if (!$order) {
            return response()->json(['error' => 'Order not created'], 500);
        }

        // création des produits commandés
        foreach ($products as $product) {
            OrderedProduct::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
            ]);
        }

        // Ajout de la propriété dynamique, peut-être un skin, une box, ou encore un sticker par exemple.
        foreach ($products as $product) {
            if (is_object($product)) {
                // Déterminer le nom de la propriété dynamiquement
                $propertyName = $product->type;

                // Vérifier que la propriété existe et est une chaîne valide
                if (property_exists($product, 'id') && is_string($propertyName)) {
                    // Assigner dynamiquement la propriété
                    $product->$propertyName = Product::find($product->id)->getRelatedItem();
                }
            }
        }

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
            // order with product
            $order->products = $order->products()->get();
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
            $user = $request->user;

            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // vérifie si l'utilisateur est un administrateur
            if ($user->isAdmin()) {
                // si l'utilisateur est un administrateur, récupère toutes les commandes
                $orders = Order::all();
            } else {
                // si l'utilisateur n'est pas un administrateur, récupère uniquement les commandes de l'utilisateur connecté
                $orders = Order::where('user_id', $user->id)->get();
            }

            return response()->json(['orders' => $orders], 200);
        }

        public function getOrdersForUser($id)
        {
            try {
                $orders = Order::where('user_id', $id)->get();
                return response()->json(['orders' => $orders], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Erreur lors de la récupération des commandes'], 500);
            }
        }

    public function getInventory(Request $request): JsonResponse
    {
        // Retrieve the authenticated user with their orders and products
        $user = User::with('inventory.products')->find($request->user->id);

        // Debugging: Check if the user and inventory are retrieved correctly
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!$user->inventory) {
            return response()->json(['message' => 'No inventory found for user'], 404);
        }

        // Debugging: Inspect inventory and products
        $products = $user->inventory->map(function ($order) {
            return $order->products;
        })->flatten();

        // Check if products are being retrieved
        if ($products->isEmpty()) {
            return response()->json(['message' => 'No products found in inventory'], 404);
        }

        // Filter paid products
        $paidProducts = $products->filter(function ($product) {
            return $product->paid;
        });

        // Debugging: Check if any paid products were found
        if ($paidProducts->isEmpty()) {
            return response()->json(['message' => 'No paid products found'], 404);
        }

        foreach ($paidProducts as $product) {
            $type = $product->type;
            $product->$type = $product->getRelatedItem();
        }

        // Convert to array and return as JSON
        return response()->json(['products' => $paidProducts->values()->toArray()], 200);
    }

}
