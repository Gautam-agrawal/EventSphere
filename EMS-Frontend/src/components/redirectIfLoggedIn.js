import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import checkTokenExpiration from '../helpers/tokenExpiryCheck';

const RedirectIfLoggedIn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the current route is '/login' and the token is not expired
    const token = localStorage.getItem('jwtToken'); // Get the JWT token from local storage
    const isTokenExpired = checkTokenExpiration(token); // Implement your token expiration logic

    if (location.pathname === '/login' && !isTokenExpired) {
      // Redirect to the '/' page
      navigate('/');
    }
  }, [navigate, location.pathname]);

  return null;
};

export default RedirectIfLoggedIn;
