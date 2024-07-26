<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminAuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (! $token = JWTAuth::attempt($credentials)) {
            return response()->json([
                "errorCode" => 400,
                "message" => "User not found",
                "success" => false
            ], 400);
        }

        // Vérifiez le rôle de l'utilisateur
        $user = Auth::user();
        $roles = json_decode($user->roles, true);

        if ($roles === null || !in_array('admin', $roles)) {
            return response()->json([
                "errorCode" => 403,
                "message" => "Access denied. Admins only.",
                "success" => false
            ], 403);
        }

        return response()->json([
            "success" => true,
            'token' => $token,
            'user' => $user
        ]);
    }
}