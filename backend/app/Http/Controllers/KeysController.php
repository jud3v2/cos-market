<?php

namespace App\Http\Controllers;

use App\Models\Keys;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KeysController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Keys::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        return response()->json(Keys::create($request->all()), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Keys $keys): JsonResponse
    {
        return response()->json($keys, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Keys $keys): JsonResponse
    {
        return response()->json($keys->update($request->all()), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Keys $keys): JsonResponse
    {
        return response()->json($keys->delete(), 204);
    }
}
