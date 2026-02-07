import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/FaceAuthContext";
import styles from "./User.module.css";

function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleClick(e) {
    e.preventDefault();
    logout();
    navigate("/");
  }

  if (!user) return null;

  const userName = user.user_metadata?.full_name || user.email?.split("@")[0];
const avatar = user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=random&color=fff`;

  return (
    <div className={styles.user}>
      <img src={avatar} alt={userName} />
      <span>Welcome, {userName}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default User;
