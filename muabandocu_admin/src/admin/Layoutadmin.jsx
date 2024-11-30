import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function Layoutadmin() {
  return (
    <div>
      <main className="flex">
        <div className="flex w-[20%] h-screen">
          <Navbar />
        </div>
        <div className="w-[80%]">
          {" "}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layoutadmin;
