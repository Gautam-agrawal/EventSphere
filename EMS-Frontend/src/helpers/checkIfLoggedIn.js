import { useJwt } from "react-jwt";

// Custom hook to check token expiration
export default function checkIfLoggedIn() {
  const storedToken = localStorage.getItem('jwtToken');
  const { decodedToken, isExpired } = useJwt(storedToken);
  return { isExpired, decodedToken };
}
