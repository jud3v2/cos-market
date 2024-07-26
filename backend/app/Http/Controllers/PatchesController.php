<?php

namespace App\Http\Controllers;

use App\Models\Patches;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatchesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Patches::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        return response()->json(Patches::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Patches $patches): JsonResponse
    {
        return response()->json($patches);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Patches $patches): JsonResponse
    {
        return response()->json($patches->update($request->all()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patches $patches): JsonResponse
    {
        return response()->json($patches->delete());
    }
}
