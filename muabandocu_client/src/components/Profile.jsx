import React, { useState } from "react";
import { hideSensitiveInfo } from "../utils/hideSensitiveInfo";
import { updateUser } from "../apis/UserApi";

function Profile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("avatar", formData.avatar);

      const result = await updateUser(formDataToSend);
      alert(result.message);
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div>
      {!isEditing ? (
        <>
          <section className="border-b py-4 ">
            <h2 className="text-lg mb-1">Hồ sơ của tôi</h2>
            <p className="text-sm">
              Quản lý thông tin hồ sơ để bảo mật tài khoản
            </p>
          </section>
          <div className="flex mt-4 gap-10 text-sm items-center ">
            <div className="flex flex-col w-1/6 gap-8 opacity-80">
              <span className="text-right block">Tên của bạn</span>
              <span className="text-right block">Email</span>
              <span className="text-right block">Số điện thoại</span>
              <span className="text-right block">Giới tính</span>
            </div>
            <div className="flex flex-col w-3/6 gap-8">
              <span>{user.name}</span>
              <span>{hideSensitiveInfo(user.email, "email")}</span>
              <span>
                {user.phone === "" || !user.phone
                  ? "Chưa cập nhật"
                  : hideSensitiveInfo(user.phone, "phone")}
              </span>
              <span>
                {user.gender === 1
                  ? "Nam"
                  : user.gender === 2
                  ? "Nữ"
                  : "Chưa cập nhật"}
              </span>
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
          <button
            onClick={() => setIsEditing(true)}
            className="bg-primaryColor py-2 w-28 text-white text-lg hover:opacity-90 mt-10 ml-36"
          >
            Thay đổi
          </button>
        </>
      ) : (
        <div>
          <h2 className="text-lg my-4 ">Chỉnh sửa hồ sơ</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Tên của bạn"
              className="border px-2 py-1"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="border px-2 py-1"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Số điện thoại"
              className="border px-2 py-1"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="border px-2 py-1"
            >
              <option value="">Chọn giới tính</option>
              <option value="1">Nam</option>
              <option value="2">Nữ</option>
            </select>
            <input type="file" onChange={handleFileChange} />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-primaryColor py-2 w-28 text-white text-lg hover:opacity-90 mt-10"
          >
            Lưu
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 py-2 w-28 text-white text-lg hover:opacity-90 mt-10 ml-4"
          >
            Hủy
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
