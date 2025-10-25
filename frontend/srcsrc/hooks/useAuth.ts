import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Using a robust library to decode the token
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface User {
  username: string;
  role: 'LANDLORD' | 'TENANT';
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({ token: null, user: null });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        // We'll fetch the full user details upon login instead of relying solely on the token for role info
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setAuthState({ token, user });
      } catch (error) {
        console.error("Invalid token found, clearing storage.", error);
        localStorage.clear();
      }
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/authenticate', { username, password });
      const { jwt } = response.data;

      // Fetch full user details to get the role
      const userResponse = await api.get(`/api/users/username/${username}`, {
          headers: { Authorization: `Bearer ${jwt}` }
      });

      const user: User = {
          username: userResponse.data.username,
          role: userResponse.data.role,
      };

      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthState({ token: jwt, user });

      // Redirect based on role
      if (user.role === 'LANDLORD') {
        navigate('/landlord');
      } else {
        navigate('/tenant');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (e.g., show a notification)
    }
  };

  const logout = () => {
    localStorage.clear();
    setAuthState({ token: null, user: null });
    navigate('/login');
  };

  return { ...authState, login, logout };
};

export default useAuth;

// Note: I'm making an assumption that a `/api/users/username/{username}` endpoint exists.
// I will need to create this endpoint in the backend.
