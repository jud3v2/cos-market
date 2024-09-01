import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Home = () => {
  // État pour gérer si le son est activé ou non
  const [isMuted, setIsMuted] = useState(true);
  // Référence pour accéder à la vidéo
  const videoRef = useRef(null);

  // Fonction pour basculer le son
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Vidéo en arrière-plan */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        src="/videos/home-video.mp4"
        autoPlay
        loop
        playsInline
        preload="auto"
        muted={isMuted} // Gère l'état du son
      />

      {/* Overlay sombre pour effet d'ombre */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 -z-10"></div>

      {/* Bouton pour mute/unmute la vidéo, positionné en haut à droite */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-full focus:outline-none"
        aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
      >
        {isMuted ? 'Son désactivé' : 'Son activé'}
      </button>

      {/* Conteneur pour le titre et la phrase d'accroche */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-8xl font-bold mb-4 text-yellow-500">Bienvenue sur COSMARKET</h1>
        <p className="text-2xl mb-6 text-white">
          Plongez dans l'univers des skins exclusifs et trouvez votre style unique !
        </p>

        {/* Bouton pour accéder à la page des produits */}
        <Link
          to="/produits"
          className="bg-yellow-500 hover:bg-yellow-600 text-white text-xl font-bold py-10 px-10 rounded-lg transition duration-300 ease-in-out"
        >
          Découvrez nos skins en vente
        </Link>
      </div>
    </div>
  );
};

export default Home;
