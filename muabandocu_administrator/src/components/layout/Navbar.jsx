import React from "react";
import { NavLink } from "react-router-dom";
function Navbar() {
  return (
    <nav className="bg-[#303134] w-full p-4 shadow-md">
      <h1>Quản trị viên</h1>
      <ul className="flex flex-col space-y-4">
        <li>
          <NavLink
            to="/"
            className={`text-white hover:text-gray-200 ${({ isActive }) =>
              isActive ? "font-bold" : ""}`}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className="text-white hover:text-gray-200"
            activeClassName="font-bold"
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className="text-white hover:text-gray-200"
            activeClassName="font-bold"
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
