import React, { useState } from "react";
import { NavLink } from "react-router-dom";
function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("permission");
  };
  return (
    <nav className="bg-[#303134] w-full py-4 shadow-md text-white">
      <h1 className="font-extrabold text-2xl text-center mb-8">
        Quản lý sản phẩm
      </h1>
      <ul className="flex flex-col pl-2 gap-4">
        <NavLink
          to="/manager"
          className={({ isActive }) =>
            isActive
              ? "font-bold hover:bg-gray-300 hover:text-gray-900 py-2 rounded-lg"
              : "hover:bg-gray-300 hover:text-gray-900 py-2 rounded-lg"
          }
        >
          <li>Danh sách sản phẩm chờ duyệt</li>
        </NavLink>
        <NavLink
          to="/login"
          className={`${({ isActive }) => (isActive ? "font-bold" : "")}`}
          onClick={handleLogout}
        >
          <li className="hover:bg-gray-300 hover:text-gray-900 hover:font-bold py-2 rounded-lg">
            Đăng xuất
          </li>
        </NavLink>
      </ul>
    </nav>
  );
}

export default Navbar;
