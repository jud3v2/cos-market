<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use App\Services\Cart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Exception\ApiErrorException;
use Stripe\StripeClient;

class PaymentController extends Controller
{
    const PAYMENT_COMPLETE = 'payment-completed';
    const PAYMENT_DECLINED = 'declined';

    public function createClientSecret(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => 'required|integer',
        ]);

        if ($request->amount < 1) {
            return response()->json([
                'message' => 'Amount must be greater than 0'
            ], 400);
        }

        $stripe = new StripeClient(env('STRIPE_SECRET'));

        $customer = $stripe->customers->create([
            'customer' => uuid_create()
        ]);

        $stripe = $stripe->paymentIntents->create([
            'amount' => $request->amount * 100,
            'currency' => 'eur',
            'customer' => $customer->id
        ]);

        return response()->json([
            'message' => 'Client secret created',
            'client_secret' => $stripe->client_secret
        ], 200);
    }

    /**
     * @throws \Stripe\Exception\ApiErrorException
     */
    public function confirmPayment(Request $request)
    {
        $request->validate([
            'payment_intent' => 'required|string',
            'payment_intent_client_secret' => 'required|string',
            'redirect_status' => 'required|string'
        ]);

        try {
            $order = Order::find($request->get('id'));

            if(!$order) {
                return response()->json([
                    'message' => 'Order not found'
                ], 404);
            }

            //TODO: voir avec l'équipe si on doit vérifier si l'order est déjà payé car cela n'a aucune importance au niveau du code.
            /*if($order->status = 'payment-completed') {
                return response()->json([
                    'message' => 'Order already paid'
                ], 400);
            }*/

            $stripe = new StripeClient(env('STRIPE_SECRET'));
            $paymentIntent = $stripe->paymentIntents->retrieve($request->get('payment_intent'));

            if(!$paymentIntent) {
                return response()->json([
                    'message' => 'Payment intent not found'
                ], 404);
            }

            if ($paymentIntent->status === 'succeeded') {
                $order->status = self::PAYMENT_COMPLETE;
                $user = User::find($order->user_id);
                // vider le panier
                //TODO: trouver pourquoi le panier ne ce vide pas.
                (new Cart($user->steam_id))->emptyCart();
            } else {
                $order->status = self::PAYMENT_DECLINED;
            }

            $order->save();

            return response()->json([
                'success' => true,
                'order' => $order,
                'message' => 'Votre paiement à bien été confirmé. Vous allez être redirigé vers votre compte.'
            ]);
        } catch(ApiErrorException $e) {
            return response()->json([
                'message' => 'Stripe Error',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
