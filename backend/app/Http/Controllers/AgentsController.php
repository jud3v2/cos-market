<?php

namespace App\Http\Controllers;

use App\Models\Agents;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AgentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Agents::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        return response()->json(Agents::create($request->all()), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Agents $agents): JsonResponse
    {
        return response()->json($agents, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Agents $agents): JsonResponse
    {
        return response()->json($agents->update($request->all()), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Agents $agents): JsonResponse
    {
        return response()->json($agents->delete());
    }
}
