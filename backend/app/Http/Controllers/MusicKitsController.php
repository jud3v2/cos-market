<?php

namespace App\Http\Controllers;

use App\Models\MusicKits;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MusicKitsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(MusicKits::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        return response()->json(MusicKits::create($request->all()));
    }
    /**
     * Display the specified resource.
     */
    public function show(MusicKits $musicKits): JsonResponse
    {
        return response()->json($musicKits);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MusicKits $musicKits): JsonResponse
    {
        return response()->json($musicKits->update($request->all()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MusicKits $musicKits): JsonResponse
    {
        return response()->json($musicKits->delete());
    }
}
