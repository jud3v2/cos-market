<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('login');
    }

    public function showRegister()
    {
        return view('register');
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (! $token = JWTAuth::attempt($credentials)) {
            return response()->json([
                "errorCode" => 400,
                "message" => "Unable to login user with combination of user password / email or username",
                "success" => false
            ], 400);
        }

        return response()->json([
            "success" => true,
            'token' => $token,
            'user' => Auth::user()
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $validate = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        if($validate) {
            $user = User::where('email', $request->email)->orWhere('name', $request->name)->first();

            if($user instanceof User) {
                return response()->json([
                    'success' => false,
                    'message' => 'User already exists',
                    'errorCode' => 400
                ], 400);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password) // encrypt user password before saving
            ]);

            if($user instanceof User) {
                // TODO: Send mail to user to verify email

                $token = JWTAuth::fromUser($user);

                return response()->json([
                    'success' => true,
                    'message' => 'User created successfully',
                    'user' => $user,
                    'token' => $token
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Unable to create user',
                'errorCode' => 400
            ], 400);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unable to create user',
            'errorCode' => 400
        ], 400);
    }
}
