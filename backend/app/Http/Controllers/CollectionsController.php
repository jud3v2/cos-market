<?php

namespace App\Http\Controllers;

use App\Models\Collections;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CollectionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Collections::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $collection = Collections::create($request->all());
        return response()->json($collection, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Collections $collections): JsonResponse
    {
        return response()->json($collections, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Collections $collections): JsonResponse
    {
        $collections->update($request->all());
        return response()->json($collections, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Collections $collections): JsonResponse
    {
        $collections->delete();
        return response()->json(null, 204);
    }
}
