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
        Quản trị viên
      </h1>
      <ul className="flex flex-col gap-4 pl-2">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            isActive
              ? "font-bold hover:bg-gray-300 hover:text-gray-900 py-2 rounded-lg"
              : "hover:bg-gray-300 hover:text-gray-900 py-2 rounded-lg"
          }
        >
          <li> Doanh thu</li>
        </NavLink>
        <NavLink
          to="/admin/product"
          className={({ isActive }) =>
            isActive
              ? "font-bold hover:bg-gray-300 hover:text-gray-900 py-2 rounded-lg"
              : "hover:bg-gray-300 hover:text-gray-900 py-2 rounded-lg"
          }
        >
          <li> Sản phẩm đã duyệt</li>
        </NavLink>
        <NavLink
          to="/admin/category"
          className={({ isActive }) =>
            isActive
              ? "font-bold hover:bg-gray-300 hover:text-gray-900 py-2 rounded-lg"
              : "hover:bg-gray-300 hover:text-gray-900 py-2 rounded-lg"
          }
        >
          <li> Quản lý loại sản phẩm</li>
        </NavLink>
        <NavLink
          to="/admin/managerAccount"
          className={({ isActive }) =>
            isActive
              ? "font-bold hover:bg-gray-300 hover:text-gray-900 py-2 rounded-lg"
              : "hover:bg-gray-300 hover:text-gray-900 py-2 rounded-lg"
          }
        >
          <li> Quản lý manager</li>
        </NavLink>
        <NavLink
          to="/admin/userAccount"
          className={({ isActive }) =>
            isActive
              ? "font-bold hover:bg-gray-300 hover:text-gray-900 py-2 rounded-lg"
              : "hover:bg-gray-300 hover:text-gray-900 py-2 rounded-lg"
          }
        >
          <li> Quản lý người dùng</li>
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? "font-bold" : "")}
          onClick={handleLogout}
        >
          <li> Đăng xuất</li>
        </NavLink>
      </ul>
    </nav>
  );
}

export default Navbar;
