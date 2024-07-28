<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;  

class SteamAuthController extends Controller
{
    private $apiKey;
    private $openid;

    public function __construct()
    {
        $this->apiKey = config('services.steam.api_key');
        $this->openid = new \LightOpenID(config('app.url'));
    }

    public function showSteamLogin()
    {
        return view('steam');
    }

    public function redirectToSteam()
    {
        $this->openid->identity = 'https://steamcommunity.com/openid';
        $this->openid->returnUrl = route('steam.callback');
        return redirect($this->openid->authUrl());
    }

    public function handleSteamCallback(Request $request)
    {
        $this->openid->returnUrl = route('steam.callback');
    
        if ($this->openid->mode == 'cancel') {
            return redirect('/')->with('error', 'Authentication cancelled.');
        }
    
        if ($this->openid->validate()) {
            $identity = $this->openid->identity;
            $steamId = basename($identity);
    
            $url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={$this->apiKey}&steamids={$steamId}";
            $response = Http::get($url);
    
            if ($response->successful()) {
                $player = $response->json()['response']['players'][0];
                $user = User::where('steam_id', $steamId)->first();
    
                if ($user) {
                    $user->update([
                        'avatar' => $player['avatarfull'],
                        'profile_url' => $player['profileurl']?? null,
                        'profile_name' => $player['personaname'],
                        'profile_country' => $player['loccountrycode'] ?? null,
                        'profile_state' => $player['locstatecode'] ?? null,
                        'profile_city' => $player['loccityid'] ?? null,
                        'profile_street' => null,
                        'profile_zip' => null,
                        'profile_phone' => null,
                        'profile_mobile' => null,
                    ]);
                } else {
                    $user = User::create([
                        'steam_id' => $steamId,
                        'avatar' => $player['avatarfull'],
                        'profile_url' => $player['profileurl'] ?? null,
                        'profile_name' => $player['personaname'],
                        'profile_country' => $player['loccountrycode'] ?? null,
                        'profile_state' => $player['locstatecode'] ?? null,
                        'profile_city' => $player['loccityid'] ?? null,
                        'profile_street' => null,
                        'profile_zip' => null,
                        'profile_phone' => null,
                        'profile_mobile' => null,
                    ]);
                }
    
                if ($response->successful ) {

                    Auth::login($user, true);
                    $token = JWTAuth::fromUser($user);
                    return redirect(env('FRONTEND_URL') . '/steam-login-success?token=' . $token);
                }
            }
        }
    
        return redirect('/register')->with('error', 'Failed to authenticate with Steam.');
    }    
}
