// useAuth.js
import { decodeToken, isExpired } from 'react-jwt';

const useAuth = () => {
    const storedToken = localStorage.getItem('jwtToken');
    return {
        isLoggedIn: storedToken && !isExpired(storedToken),
        decodedToken: storedToken && decodeToken(storedToken),
    };
};

export default useAuth;
