<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        if(isset($_GET['limit']) && isset($_GET['page'])) {
            $limit = $_GET['limit'];
            $page = $_GET['page'];
            return response()->json([
                'products' => Product::paginate($limit, ['*'], 'page', $page),
                'total' => Product::count(),
                'limit' => $limit,
                'page' => $page,
                'success' => true,
            ]);
        }

        if(isset($_GET['limit'])) {
            $limit = $_GET['limit'];
            return response()->json([
                'products' => Product::paginate($limit),
                'total' => Product::count(),
                'limit' => $limit,
                'success' => true,
            ]);
        }

        return response()->json([
            'products' => Product::all(),
            'success' => true,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validate the request data
            $validatedData = $request->validate([
                'type' => 'required|string',
                'item_id' => 'required|string',
                'stock' => 'required|integer',
                'name' => 'required|string',
                'price' => 'required|numeric',
                'isActive' => 'required|boolean',
                'description' => 'required|string|min:10',
                'slug' => 'nullable|string' // Make slug nullable
            ]);

            $validatedData['slug'] = $validatedData['slug'] ?? Str::slug($validatedData['name']);

            $product = Product::create($validatedData);

            return response()->json($product, 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Product $product): JsonResponse
    {
        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        try {
            $data = $request->validate([
                'type' => 'required|string',
                'item_id' => 'required|string',
                'stock' => 'required|integer',
                'name' => 'required|string',
                'price' => 'required|numeric',
                'isActive' => 'required|boolean',
                'description' => 'required|string|min:10',
            ]);

            $product->update($data);

            return response()->json($product);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(null, 204);
    }
}
