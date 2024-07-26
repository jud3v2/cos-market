<?php

namespace App\Http\Controllers;

use App\Models\Stickers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StickersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Stickers::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        return response()->json(Stickers::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Stickers $stickers): JsonResponse
    {
        return response()->json($stickers);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Stickers $stickers): JsonResponse
    {
        return response()->json($stickers->update($request->all()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stickers $stickers): JsonResponse
    {
        return response()->json($stickers->delete());
    }
}
