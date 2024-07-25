<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Ecommerce</title>
</head>
<body class="bg-blue-100 h-screen flex items-center justify-center">

    <div class="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 class="text-2xl mb-4 font-semibold text-gray-800">Inscription</h2>
        <form action="{{ route('register') }}" method="POST">
            @csrf
            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" class="mt-1 block w-full border-black border-2">
            </div>
            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700">Mot de Passe</label>
                <input type="password" name="password" id="password" class="mt-1 block w-full border-black border-2">
            </div>
            <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700">Pseudo</label>
                <input type="text" name="name" id="name" class="mt-1 block w-full border-black border-2">
            </div>
            <div class="mb-4">
                <button type="submit" class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-400 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">S'inscrire</button>
            </div>
            <div class="mb-4">
                <p for="name" class="block text-sm font-medium text-gray-700">Tu as déjà un compte ?</p>
                <div class="mt-2">
                    <a href="login" class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-400 hover:bg-red-800">Connecte toi !</a>
                </div>
            </div>
        </form>
    </div>
</body>
</html>