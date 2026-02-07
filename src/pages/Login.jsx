import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../componets/PageNav";
import { useAuth } from "../Context/FaceAuthContext";
import Button from "../componets/Button";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const { login, signup, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;

    if (isSignUp) {
      signup(email, password);
    } else {
      login(email, password);
    }
  }

  useEffect(() => {
    if (isAuthenticated) navigate("/app", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email address"
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter your password"
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Button type="primary">{isSignUp ? "Sign Up Now" : "Login"}</Button>
          <p
            style={{
              textAlign: "center",
              fontSize: "1.4rem",
              color: "var(--color-light--2)",
            }}
          >
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              style={{
                color: "var(--color-brand--2)",
                cursor: "pointer",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
              onClick={(e) => {
                e.preventDefault();
                setIsSignUp(!isSignUp);
              }}
            >
              {isSignUp ? "Login" : "Register"}
            </span>
          </p>
        </div>
        {error && (
          <p style={{ color: "red", fontSize: "1.4rem", textAlign: "center" }}>{error}</p>
        )}
      </form>
    </main>
  );
}
