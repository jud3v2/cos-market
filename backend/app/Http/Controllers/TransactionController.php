<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        if(isset($_GET['user_id'])) {
            $t = Transaction::where('user_id', $_GET['user_id'])->get();
            return response()->json($t);
        } else {
            return response()->json(Transaction::all());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => 'required|integer',
            'type' => 'required|string',
            'amount' => 'required|numeric',
        ]);

        if($data['type'] !== 'withdraw' && $data['type'] !== 'deposit') {
            return response()->json(['message' => 'Invalid transaction type'], 400);
        }

        if(User::find($data['user_id']) === null) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $data['transaction_id'] = "cosmarket_" . uniqid();

        $transaction = Transaction::create($data);

        return response()->json($transaction, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction): JsonResponse
    {
        return response()->json([
            'transaction_id' => $transaction->transaction_id,
            'user_id' => $transaction->user_id,
            'type' => $transaction->type,
            'amount' => $transaction->amount,
        ]);
    }

    public function getLastTransaction($id): JsonResponse
    {
        return response()->json(Transaction::where('user_id', $id)->orderBy('created_at', 'desc')->first());
    }
}
