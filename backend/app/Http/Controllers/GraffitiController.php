<?php

namespace App\Http\Controllers;

use App\Models\Graffiti;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GraffitiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Graffiti::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        return response()->json(Graffiti::create($request->all()), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Graffiti $graffiti): JsonResponse
    {
        return response()->json($graffiti);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Graffiti $graffiti): JsonResponse
    {
        return response()->json($graffiti->update($request->all()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Graffiti $graffiti): JsonResponse
    {
        return response()->json($graffiti->delete());
    }
}
