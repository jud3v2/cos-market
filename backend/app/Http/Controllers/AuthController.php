<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;

require '../services/security/JWTGenerator.php';

class AuthController extends Controller
{
    /**
     * @description Login a user
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */

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
        dd($request->all());
        $isOk = auth()->attempt($request->only('email', 'password')) || auth()->attempt($request->only('name', 'password'));

        if(!$isOk) {
            return response()->json([
                "errorCode" => 400,
                "message" => "Unable to login user with combination of user password / email or username",
                "success" => false
            ], 400);
        }

        return response()->json([
            "success" => true,
            'token' => (new JwtGenerator())->generateToken([
                'sub' => auth()->id(),
                'user' => auth()->user(),
            ]),
            'user' => auth()->user()
        ]);
    }

    /**
     * @description Register a new user
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse
     */
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

                return response()->json([
                    'success' => true,
                    'message' => 'User created successfully',
                    'user' => $user,
                    'token' => (new JwtGenerator())->generateToken([
                        'sub' => $user->id,
                        'user' => $user
                    ])
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
