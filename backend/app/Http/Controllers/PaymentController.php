<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Stripe\StripeClient;

class PaymentController extends Controller
{
    public function createClientSecret(Request $request)
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
}
