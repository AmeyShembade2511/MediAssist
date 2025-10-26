// frontend/src/auth/useAuth.js
import { useContext } from "react";
import { AuthContext } from "./AuthProvider.jsx";
export default function useAuth() {
  return useContext(AuthContext);
}
