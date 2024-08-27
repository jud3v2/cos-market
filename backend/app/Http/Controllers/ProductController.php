<?php

namespace App\Http\Controllers;

use App\Jobs\UnblockProductJob;
use App\Models\Product;
use App\Models\Skin;
use Carbon\Carbon;
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

        // Get all products where is not blocked by a user
        $products = Product::where('blocked_at', null)->get();

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

    public function blockProduct(Request $request): JsonResponse
    {
        $product = Product::find($request->route('id'));

        if(!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->in_user_id_cart = (int) $request->get('user_id');

        $product->blocked_at = Carbon::now('Europe/Paris');

        $product->update(['in_user_id_cart' => $product->in_user_id_cart, 'blocked_at' => $product->blocked_at]);
        $product->save();

        dispatch(new UnblockProductJob($product))->delay(now()->addMinutes(15));

        return response()->json($product);
    }

    public function unblockProduct(Request $request, Product $product): JsonResponse
    {
        $product->blocked_at = null;
        $product->unblocked_at = Carbon::now();
        $product->in_user_id_cart = null;
        $product->save();

        return response()->json($product);
    }

    public function isProductBlocked(Request $request): JsonResponse
    {
        $product = Product::find($request->route('id'));

        if(!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $blockedAt = Carbon::parse($product->blocked_at, 'Europe/Paris');
        $unblockTime = Carbon::parse($blockedAt, 'Europe/Paris')->addMinutes(15);
        $timeLeft = $unblockTime->diffForHumans(Carbon::now('UTC'), true);

        //dd($unblockTime->isAfter($blockedAt), $unblockTime->isBefore($blockedAt), $unblockTime, $blockedAt);

        if($product->blocked_at === null && $product->in_user_id_cart === null) {
            return response()->json(['message' => 'Product is not blocked', 'isBlocked' => false]);
        }

        if($product->blocked_at !== null && $blockedAt->isBefore($unblockTime)){
            return response()->json([
                'message' => 'Product is blocked because is in a user cart a timeout of blocked product are not done',
                'availability' => $timeLeft,
                'isBlocked' => true
            ]);
        } elseif($product->blocked_at !== null && $blockedAt->isAfter($unblockTime)) {
            return response()->json([
                'message' => 'Product is not blocked',
                'isBlocked' => false
            ]);
        }

        return response()->json(['isBlocked' => $product->blocked_at === null, 'message' => 'Product is not blocked', 'blocked_at' => $product->blocked_at, 'unblocked_at' => $product->unblocked_at, 'availability' => $timeLeft]);
    }
}
