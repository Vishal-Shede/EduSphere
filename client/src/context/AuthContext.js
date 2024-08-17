import React, { createContext, useReducer, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext();

// Define action types
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGOUT = 'LOGOUT';
const SET_USER = 'SET_USER';

// Define the initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem('token') || null,
};

// Create a reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        token: action.payload.token,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        token: null,
      };
    default:
      return state;
  }
};

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/v1/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: { token, user },
      });

      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.response.data);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: LOGOUT });
    navigate('/login');
  };

  // Fetch the authenticated user's data
  const fetchUser = async () => {
    if (!state.token) return;

    try {
      const res = await axios.get('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${state.token}` },
      });

      dispatch({
        type: SET_USER,
        payload: res.data.data,
      });
    } catch (error) {
      console.error('Failed to fetch user:', error.response.data);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
