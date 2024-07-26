<?php

namespace App\Http\Controllers;

use App\Models\Crates;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CratesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Crates::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $crate = Crates::create($request->all());
        return response()->json($crate, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Crates $crates): JsonResponse
    {
        return response()->json($crates);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Crates $crates): JsonResponse
    {
        return response()->json($crates->update($request->all()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Crates $crates): JsonResponse
    {
        return response()->json($crates->delete());
    }
}
