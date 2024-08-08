<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Models\Skin;
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

        $products = Product::all();

        foreach ($products as $product) {
            $product[$product->type] = $product->getRelatedItem();
        }

        return response()->json([
            'products' => $products,
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
                'usage' => 'required|string', // Make usage nullable
                'slug' => 'nullable|string' // Make slug nullable
            ], [
                'usage.required' => 'Usage is required',
                'usage.string' => 'Usage must be a string value',
            ]);

            $validatedData['slug'] = $validatedData['slug'] ?? Str::slug($validatedData['name']);

            if($validatedData['type'] === 'skin') {
                $skin = Skin::where('cs_go_id', $validatedData['item_id'])->first();
                if(!$skin) {
                    return response()->json(['message' => 'Skin not found'], 404);
                } else {
                    //check usage validation
                    if((float) $validatedData['usage'] < (float) $skin->min_float) {
                        return response()->json(['message' => 'Usage must be greater than or equal to the minimum float value of the skin', [
                            'values' => [
                                'min_float' => $skin->min_float,
                                'max_float' => $skin->max_float
                            ]
                        ]], 422);
                    } else if((float) $validatedData['usage'] > (float) $skin->max_float) {
                        return response()->json(['message' => 'Usage must be less than or equal to the maximum float value of the skin', [
                            'values' => [
                                'min_float' => $skin->min_float,
                                'max_float' => $skin->max_float
                            ]
                        ]], 422);
                    }
                }
            }

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
        return response()->json(['product' => $product, 'success' => true, 'item' => $product->getRelatedItem()]);
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
                'usage' => 'required|string',
            ], [
                'usage.required' => 'Usage is required',
                'usage.string' => 'Usage must be a string value',
            ]);


            if($data['type'] === 'skin') {
                $skin = Skin::where('cs_go_id', $data['item_id'])->first();
                if(!$skin) {
                    return response()->json(['message' => 'Skin not found'], 404);
                } else {
                    //check usage validation
                    if((float) $data['usage'] < (float) $skin->min_float) {
                        return response()->json(['message' => 'Usage must be greater than or equal to the minimum float value of the skin', [
                            'values' => [
                                'min_float' => $skin->min_float,
                                'max_float' => $skin->max_float
                            ]
                        ]], 422);
                    } else if((float) $data['usage'] > (float) $skin->max_float) {
                        return response()->json(['message' => 'Usage must be less than or equal to the maximum float value of the skin', [
                            'values' => [
                                'min_float' => $skin->min_float,
                                'max_float' => $skin->max_float
                            ]
                        ]], 422);
                    }
                }
            }

            $product->slug = $data['slug'] ?? Str::slug($data['name']);

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