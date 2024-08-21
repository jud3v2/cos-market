<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class VerifyUserAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        Log::info('VerifyUserAdmin middleware triggered');

        $token = $request->header('Authorization');

        if (!$token) {
            Log::warning('No token provided');
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            $payload = JWTAuth::parseToken()->getPayload();
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            Log::warning('Token expired');
            return response()->json(['error' => 'Token expired'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            Log::warning('Token invalid');
            return response()->json(['error' => 'Token invalid'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            Log::warning('JWT Exception');
            return response()->json(['error' => 'JWT Exception'], 401);
        }

        if (!isset($payload['sub'])) {
            Log::warning('No subject in token payload');
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = User::find($payload['sub']);

        if (!$user) {
            Log::warning('User not found');
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $roles = json_decode($user->roles, true);

        if ($roles !== null && !in_array("admin", $roles)) {
            Log::warning('User not admin');
            return response()->json(['error' => $roles], 401);
        }

        $request->attributes->add(['admin' => $user]);
        $request->admin = $user;
        return $next($request);
    }
}
