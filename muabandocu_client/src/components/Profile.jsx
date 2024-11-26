import React from "react";
import Button from "./Button";
import { hideSensitiveInfo } from "../utils/hideSensitiveInfo";
function Profile({ user }) {
  const phone =
    user.phone === "" || !user.phone
      ? "Chưa cập nhật"
      : hideSensitiveInfo(user.phone, "phone");
  const gender =
    user.gender === 1 ? "Nam" : user.gender === 2 ? "Nữ" : "Chưa cập nhật";

  // const formatDate = (dateString) => {
  //   if (!dateString) return "Chưa cập nhật";
  //   const date = new Date(dateString);
  //   const day = date.getDate().toString().padStart(2, "0");
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0");
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // };

  // const birthday = formatDate(user.birthday);
  return (
    <div>
      <section className="border-b py-4 ">
        <h2 className="text-lg mb-1">Hồ sơ của tôi</h2>
        <p className="text-sm">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </section>
      <div className="flex mt-4 gap-10 text-sm items-center ">
        <div className="flex flex-col w-1/6 gap-8 opacity-80">
          <span className="text-right block">Tên của bạn</span>
          <span className="text-right block">Email</span>
          <span className="text-right block">Số điện thoại</span>
          <span className="text-right block">Giới tính</span>
          {/* <span className="text-right block">Ngày sinh</span> */}
        </div>
        <div className="flex flex-col w-3/6 gap-8">
          <span>{user.name}</span>
          <span>{hideSensitiveInfo(user.email, "email")}</span>
          <span>{phone}</span>
          <span>{gender}</span>
          {/* <span>{birthday}</span> */}
        </div>
        <div className="w-2/6 flex-center">
          <div className="w-28 h-28 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={`http://localhost:3000/${user.avatar}`}
              alt=""
            />
          </div>
        </div>
      </div>
      <button className="bg-primaryColor py-2 w-28 text-white text-lg hover:opacity-90 mt-10 ml-36">
        Thay đổi
      </button>
    </div>
  );
}

export default Profile;
