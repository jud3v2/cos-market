<?php

namespace App\Http\Controllers;

use App\Models\BulletCoin;
use App\Models\BulletCoinTransaction;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BulletCoinController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // initialise a new bullet coin
        $bulletCoin = new BulletCoin();

        if(!isset($request->user_id)) {
            return response()->json(['message' => 'User ID is required'], 400);
        } elseif(User::find($request->user_id) === null) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // check if the user has already been assigned a bullet coin

        if($b = BulletCoin::where('user_id', $request->user_id)->first() !== null) {
            return response()->json(['message' => 'User already has a bullet coin field', 'bulletcoin' => $b], 400);
        }

        $bulletCoin->user_id = $request->user_id;
        $bulletCoin->amount =  0;
        $save = $bulletCoin->save();

        return response()->json($bulletCoin, $save ? 201 : 400);
    }

    /**
     * Display the specified resource.
     */
    public function show(BulletCoin $bulletCoin): JsonResponse
    {
        return response()->json($bulletCoin, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $data = $request->validate([
            'amount' => 'required|integer',
            'user_id' => 'required|integer',
            'description' => 'required|string',
            'status' => 'required|string',
            'transaction_id' => 'required|string',
            'type' => 'required|string'
        ], [
            'amount.required' => 'Amount is required',
            'amount.integer' => 'Amount must be an integer',
            'user_id.required' => 'User ID is required',
            'user_id.integer' => 'User ID must be an integer',
            'description.required' => 'Description is required',
            'description.string' => 'Description must be a string',
            'status.required' => 'Status is required',
            'status.string' => 'Status must be a string',
            'transaction_id.required' => 'Transaction ID is required',
            'transaction_id.string' => 'Transaction ID must be a string',
            'type.required' => 'Type is required',
            'type.string' => 'Type must be a string'
        ]);

        $bulletCoin = BulletCoin::where('id', $id)->first();

        if($bulletCoin === null) {
            return response()->json(['message' => 'Bullet coin not found'], 404);
        }

        $bulletCoin->amount = $data['amount'];
        $bulletCoin->user_id = $data['user_id'];

        if($bulletCoin->amount < 0) {
            return response()->json(['message' => 'Amount must be greater than 0'], 400);
        }

        if($data['type'] === 'withdraw' && $bulletCoin->amount > 0) {
            $bulletCoin->amount = $bulletCoin->amount - $data['amount']; // withdraw
        } elseif($data['type'] === 'deposit' && $bulletCoin->amount > 0) {
            $bulletCoin->amount = $bulletCoin->amount + $data['amount']; // deposit
        } else {
            return response()->json(['message' => 'Invalid transaction type'], 400);
        }

        $t = Transaction::where('transaction_id', $data['transaction_id'])->first();

        if($t === null) {
            return response()->json(['message' => 'Transaction not found'], 404);
        } else if($t->type ===  'deposit' || $t->type === 'withdraw') {
            if((int) $t->amount === (int) $data['amount']) {
                if($data['type'] === $t->type) {
                    // check if the transaction has already been processed
                    $bt = BulletCoinTransaction::where('transaction_id', $data['transaction_id'])->first();
                    if($bt !== null) {
                        return response()->json(['message' => 'Transaction already processed'], 400);
                    }
                    $data['bullet_coin_id'] = $bulletCoin->id;
                    $save = $bulletCoin->update();
                    (new BulletCoinTransaction())->registerTransation($data);
                    return response()->json($bulletCoin, $save ? 200 : 400);
                }
            }
        }

        return response()->json(['message' => 'Invalid transaction'], 400);
    }
}
