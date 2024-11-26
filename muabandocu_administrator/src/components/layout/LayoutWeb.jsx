import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function LayoutWeb() {
  return (
    <div>
      <main className="flex">
        <div className="flex w-[20%] h-screen">
          <Navbar />
        </div>
        <div>
          {" "}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default LayoutWeb;
