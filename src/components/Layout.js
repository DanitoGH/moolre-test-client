import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="wrapper">
      <Navbar />
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
