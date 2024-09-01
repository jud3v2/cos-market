import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Home = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Vidéo en arrière-plan */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        src="/videos/home-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* Overlay sombre pour effet d'ombre */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 -z-10"></div>

      {/* Conteneur pour le titre et la phrase d'accroche */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-8xl font-bold mb-4 text-yellow-500">Bienvenue sur COSMARKET</h1>
        <p className="text-2xl mb-6 text-white">
          Plongez dans l'univers des skins exclusifs et trouvez votre style unique !
        </p>

        {/* Bouton pour accéder à la page des produits */}
        <Link to="/produits" className="bg-yellow-500 hover:bg-yellow-600 text-white text-xl font-bold py-10 px-10 rounded-lg transition duration-300 ease-in-out">
          Découvrez nos skins en vente
        </Link>
      </div>
    </div>
  );
};

export default Home;
