import { createContext, useContext, useEffect, useReducer } from "react";

import {
  login as loginApi,
  logout as logoutApi,
  signup as signupApi,
  getCurrentUser,
} from "../services/apiAuth";

const AuthContext = createContext();
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      return state;
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(reducer, initialState);

  useEffect(function () {
    async function checkUser() {
      try {
        const user = await getCurrentUser();
        if (user) {
          dispatch({ type: "login", payload: user });
        }
      } catch {
        // ignore error
      }
    }

    checkUser();
  }, []);

  async function login(email, password) {
    dispatch({ type: "loading" });
    try {
      const data = await loginApi({ email, password });
      if (data.user) {
        dispatch({ type: "login", payload: data.user });
      }
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  async function signup(email, password) {
    dispatch({ type: "loading" });
    try {
      const data = await signupApi({ email, password });
      if (data.user) {
        dispatch({ type: "login", payload: data.user });
      }
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  async function logout() {
    dispatch({ type: "loading" });
    try {
      await logoutApi();
      dispatch({ type: "logout" });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth was used outside the AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
