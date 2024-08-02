import { jwtDecode } from 'jwt-decode';

export const getSteamId = () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded?.user?.steam_id;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
    }
  } else {
    console.warn('Aucun token trouvé dans le localStorage');
  }

  return null;
};