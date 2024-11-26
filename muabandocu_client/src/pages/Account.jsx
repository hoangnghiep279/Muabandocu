import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import { FaRegUser } from "react-icons/fa6";
import { BsHandbag } from "react-icons/bs";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { MdOutlineNotifications } from "react-icons/md";
import Profile from "../components/Profile";

function Account() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Bạn chưa đăng nhập!");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.data);
      } catch (error) {
        console.error(
          "Lỗi khi lấy thông tin người dùng:",
          error.response.data.message || error.message
        );
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <Loading />;
  }

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
              <span className="flex items-center gap-2 font-medium">
                {" "}
                <FaRegUser /> Tài khoản của tôi
              </span>
              <ul className="text-sm ml-7 opacity-80 ">
                <li className="my-3">Hồ sơ</li>
                <li>Đổi mật khẩu</li>
              </ul>
            </li>
            <li>
              <span className="flex items-center gap-2 font-medium">
                <BsHandbag /> Quản lý sản phẩm
              </span>
              <li className="text-sm ml-7 opacity-80 mt-3">Thêm sản phẩm</li>
            </li>
            <li>
              <span className="flex items-center gap-2 font-medium">
                <HiOutlineClipboardDocumentList />
                Đơn mua
              </span>
            </li>
            <li>
              <span className="flex items-center gap-2 font-medium">
                <MdOutlineNotifications />
                Thông báo
              </span>
            </li>
          </ul>
        </section>
        <section className="w-4/5 box-shadow px-6 pb-8">
          <Profile user={user} />
        </section>
      </div>
    </main>
  );
}

export default Account;
