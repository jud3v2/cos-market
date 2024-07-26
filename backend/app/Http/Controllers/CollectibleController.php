<?php

namespace App\Http\Controllers;

use App\Models\Collectible;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CollectibleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Collectible::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        return response()->json(Collectible::create($request->all()), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Collectible $collectible): JsonResponse
    {
        return response()->json($collectible, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Collectible $collectible): JsonResponse
    {
        return response()->json($collectible->update($request->all()), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Collectible $collectible): JsonResponse
    {
        return response()->json($collectible->delete());
    }
}
