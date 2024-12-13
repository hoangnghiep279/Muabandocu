import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { FaRegUser } from "react-icons/fa6";
import { BsHandbag } from "react-icons/bs";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { MdOutlineNotifications } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import Profile from "../components/Profile";
import { getProfile } from "../apis/UserApi";
import ChangePassword from "../components/ChangePassword";
import UserProduct from "../components/UserProduct";
import UserPendingProduct from "../components/UserPendingProduct";
import AddProduct from "../components/AddProduct";
import Address from "../components/Address";

function Account() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Bạn chưa đăng nhập!");
        return;
      }

      getProfile(setUser, token);
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <Loading />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <Profile user={user} />;
      case "changePassword":
        return <ChangePassword user={user} />;
      case "userProduct":
        return <UserProduct />;
      case "pendingproduct":
        return <UserPendingProduct />;
      case "addproduct":
        return <AddProduct />;
      case "address":
        return <Address />;
      case "notifications":
        return <Notifications />;
      default:
        return <Profile user={user} />;
    }
  };

  return (
    <main className="font-manrope bg-[#F5F5F5] p-14">
      <div className="container flex">
        <section className="w-1/5">
          <div className="flex items-center gap-3">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={`http://localhost:3000/${user.avatar}`}
              alt=""
            />
            <p className="flex flex-col mt-1">
              <span className="font-semibold">{user.name}</span>
              <span className="text-xs">
                {new Date(user.create_at).toLocaleDateString("vi-VN")}
              </span>
            </p>
          </div>
          <ul className="flex flex-col gap-3 mt-8">
            <li>
              <span className="flex items-center gap-2 font-medium cursor-pointer">
                <FaRegUser /> Tài khoản của tôi
              </span>
              <ul className="text-sm ml-7 opacity-80 ">
                <li
                  onClick={() => {
                    setActiveSection("profile");
                  }}
                  className={`my-3 cursor-pointer ${
                    activeSection === "profile"
                      ? "font-semibold ease-linear duration-200"
                      : ""
                  }`}
                >
                  Hồ sơ
                </li>
                <li
                  onClick={() => {
                    setActiveSection("changePassword");
                  }}
                  className={`my-3 cursor-pointer ${
                    activeSection === "changePassword"
                      ? "font-semibold ease-linear duration-200"
                      : ""
                  }`}
                >
                  Đổi mật khẩu
                </li>
              </ul>
            </li>
            <li>
              <span className="flex items-center gap-2 font-medium cursor-pointer">
                <BsHandbag /> Quản lý sản phẩm
              </span>

              <button
                onClick={() => {
                  setActiveSection("userProduct");
                }}
                className={`my-3 cursor-pointer text-sm ml-7 opacity-80 mt-3 ${
                  activeSection === "userProduct"
                    ? "font-semibold ease-linear duration-200"
                    : ""
                }`}
              >
                Sản phẩm của bạn
              </button>
              <button
                onClick={() => {
                  setActiveSection("pendingproduct");
                }}
                className={`my-3 cursor-pointer text-sm ml-7 opacity-80 mt-3 ${
                  activeSection === "pendingproduct"
                    ? "font-semibold ease-linear duration-200"
                    : ""
                }`}
              >
                Sản phẩm chờ duyệt
              </button>
              <button
                onClick={() => {
                  setActiveSection("addproduct");
                }}
                className={`my-3 cursor-pointer text-sm ml-7 opacity-80 mt-3 ${
                  activeSection === "addproduct"
                    ? "font-semibold ease-linear duration-200"
                    : ""
                }`}
              >
                Thêm sản phẩm
              </button>
            </li>

            <li onClick={() => setActiveSection("address")}>
              <span className="flex items-center gap-2 font-medium cursor-pointer">
                <IoLocationOutline /> Địa chỉ
              </span>
            </li>
            <li onClick={() => setActiveSection("orders")}>
              <span className="flex items-center gap-2 font-medium cursor-pointer">
                <HiOutlineClipboardDocumentList /> Đơn mua
              </span>
            </li>
            <li onClick={() => setActiveSection("notifications")}>
              <span className="flex items-center gap-2 font-medium cursor-pointer">
                <MdOutlineNotifications /> Thông báo
              </span>
            </li>
          </ul>
        </section>

        {/* Main Content */}
        <section className="w-4/5 box-shadow px-6 pb-8">
          {renderSection()}
        </section>
      </div>
    </main>
  );
}

export default Account;
