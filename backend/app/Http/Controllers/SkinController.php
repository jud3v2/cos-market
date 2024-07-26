<?php

namespace App\Http\Controllers;

use App\Models\Skin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkinController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        //TODO: implement page and limit query parameters
        return response()->json(Skin::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        return response()->json(Skin::create($request->all()), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Skin $skin): JsonResponse
    {
        return response()->json($skin);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Skin $skin): JsonResponse
    {
        return response()->json($skin->update($request->all()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Skin $skin): JsonResponse
    {
        return response()->json($skin->delete());
    }
}
