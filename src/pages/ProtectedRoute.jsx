import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/FaceAuthContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(
    function () {
      if (!isAuthenticated) {
        navigate("/", { replace: true });
      }
    },
    [isAuthenticated, navigate],
  );

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
