import Map from "../componets/Map";
import Sidebar from "../componets/Sidebar";
import styles from "./AppLayout.module.css";
import User from "../componets/User";
function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      <User />
    </div>
  );
}

export default AppLayout;
