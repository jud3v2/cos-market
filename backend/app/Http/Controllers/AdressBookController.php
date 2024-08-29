<?php

namespace App\Http\Controllers;

use App\Models\AdressBook;
use Illuminate\Http\Request;

class AdressBookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user;

        // Récupérer toutes les adresses de l'utilisateur authentifié
        $adressBooks = AdressBook::where('user_id', $user->id)->get();
        return response()->json($adressBooks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'address' => 'required',
            'city' => 'required',
            'zipcode' => 'required',
            'country' => 'required',
        ]);

        $user = $request->user;

        // Si l'adresse est définie par défaut, désactiver les autres adresses par défaut de l'utilisateur
        if ($request->isDefault) {
            AdressBook::where('user_id', $user->id)
                ->update(['isDefault' => false]);
        }

        $adressBook = AdressBook::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'address' => $request->address,
            'city' => $request->city,
            'zipcode' => $request->zipcode,
            'country' => $request->country,
            'isDefault' => $request->isDefault ?? false,
        ]);

        return response()->json($adressBook);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, AdressBook $adressBook)
    {
        // Récupérer l'utilisateur authentifié du middleware
        $user = $request->user;

        if ($adressBook->user_id !== $user->id) {
            return response()->json(['error' => 'Non autorisé.'], 403);
        }

        return response()->json($adressBook);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AdressBook $adressBook)
    {
        $request->validate([
            'name' => 'required',
            'address' => 'required',
            'city' => 'required',
            'zipcode' => 'required',
            'country' => 'required',
        ]);

        // Récupérer l'utilisateur authentifié du middleware
        $user = $request->user;

        if ($adressBook->user_id !== $user->id) {
            return response()->json(['error' => 'Non autorisé.'], 403);
        }

        // Si l'adresse est définie par défaut, désactiver les autres adresses par défaut de l'utilisateur
        if ($request->isDefault) {
            AdressBook::where('user_id', $user->id)
                ->where('id', '!=', $adressBook->id)
                ->update(['isDefault' => false]);
        }

        // Mettre à jour l'adresse
        $adressBook->update($request->all());
        return response()->json($adressBook);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, AdressBook $adressBook)
    {
        // Récupérer l'utilisateur authentifié du middleware
        $user = $request->user;

        if ($adressBook->user_id !== $user->id) {
            return response()->json(['error' => 'Non autorisé.'], 403);
        }

        $adressBook->delete();
        return response()->json(['message' => 'Adresse supprimée avec succès'], 204);
    }
}
