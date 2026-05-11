import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "./Footer";

function Layout() {
  return (
    <>
      <div className="min-h-screen bg-background text-primary font-sans ">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Layout;
