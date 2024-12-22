import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import Crolltotop from "../Crolltotop";

function LayoutWeb() {
  return (
    <div>
      <header className="sticky top-[-20px] z-50 bg-white shadow-md">
        <Header />
        <Crolltotop />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default LayoutWeb;
