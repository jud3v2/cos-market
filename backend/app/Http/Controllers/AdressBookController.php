<?php

namespace App\Http\Controllers;

use App\Models\AdressBook;
use Illuminate\Http\Request;

class AdressBookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ici on récupère l'adresse par défaut
        $adressBook = AdressBook::where('isDefault', true)->first();
        return response()->json($adressBook);
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

        // Ici on stocke l'adresse par défaut + si l'adresse est par défaut on enlève l'ancinne adresse par défaut
        $adressBook = AdressBook::create($request->all());

        if ($adressBook->isDefault) {
            $getallAdressBook = AdressBook::where('user_id', $adressBook->user_id)->where('id', '!=', $adressBook->id)->get();
            foreach ($getallAdressBook as $getallAdressBook) {
                $getallAdressBook->isDefault = false;
                $getallAdressBook->save();
            }
        }
        return response()->json($adressBook);
    }

    /**
     * Display the specified resource.
     */
    public function show(AdressBook $adressBook)
    {
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

        // Ici on met à jour l'adresse par défaut
        $adressBook->update($request->all());
        return response()->json($adressBook);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AdressBook $adressBook)
    {
        $adressBook->delete();
        return response()->json(['message' => 'Adresse supprimée avec succès'], 204);
    }
}
