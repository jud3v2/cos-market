<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SteamAuthController extends Controller
{
    private $apiKey;
    private $openid;

    public  function showSteamLogin()
    {
        return view('steam');
    }

    public function __construct()
    {
        $this->apiKey = config('services.steam.api_key');
        $this->openid = new \LightOpenID(config('app.url'));
    }

    public function redirectToSteam()
    {
        $this->openid->identity = 'https://steamcommunity.com/openid';
        return redirect($this->openid->authUrl());
    }

    public function handleSteamCallback(Request $request)
    {
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
                // Connectez l'utilisateur ou enregistrez-le dans votre base de données

                return redirect('/')->with('success', 'Connexion réussie !');
            }
        }

        return redirect('/')->with('error', 'Failed to authenticate with Steam.');
    }
}
