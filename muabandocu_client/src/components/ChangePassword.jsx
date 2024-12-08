import React, { useState } from "react";
import { changePassword } from "../apis/UserApi";

function ChangePassword() {
  const [formData, setFormData] = useState({ password: "", newPassword: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!formData.password) {
      setError("Mật khẩu hiện tại không được để trống.");
      return false;
    }
    if (!formData.newPassword) {
      setError("Mật khẩu mới không được để trống.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await changePassword(formData);
      alert(result.message);
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg my-4">Đổi mật khẩu của bạn</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col w-1/3 gap-2">
          <label htmlFor="password">Mật khẩu hiện tại</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Nhập mật khẩu hiện tại"
            className={`border px-2 py-1 ${
              error && !formData.password ? "border-red-500" : ""
            }`}
          />
        </div>
        <div className="flex flex-col w-1/3 gap-2">
          <label htmlFor="newPassword">Mật khẩu mới</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="Nhập mật khẩu mới"
            className={`border px-2 py-1 ${
              error && !formData.newPassword ? "border-red-500" : ""
            }`}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`bg-primaryColor py-2 w-28 text-white text-lg mt-10 ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
        }`}
      >
        {isLoading ? "Đang lưu..." : "Lưu"}
      </button>
    </form>
  );
}

export default ChangePassword;
