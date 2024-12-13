import axios from "axios";
import { toast } from "react-toastify";
import { Validation } from "../utils/Validation";
const registerUser = async (values, setError, navigate) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/users/register",
      {
        name: values.name,
        email: values.email,
        password: values.password,
      }
    );
    toast("Đăng ký tài khoản thanh công", { type: "success" });
    navigate("/login");
  } catch (error) {
    if (error.response && error.response.status === 401) {
      setError({ email: "Email đã tồn tại. Vui lòng chọn email khác." });
    } else {
      setError(Validation(values));
    }
  }
};

const loginUser = async (values, setError, navigate) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/users/user-login",
      {
        email: values.email,
        password: values.password,
      }
    );

    if (response && response.data.data && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      toast("Đăng nhập thành công", { type: "success" });
      navigate("/");
    } else {
      toast("Token không hợp lệ", { type: "error" });
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      toast(error.response.data.message, { type: "error" });
      setError({ serverError: error.response.data.message });
    } else {
      toast("Đăng nhập thất bại", { type: "error" });
    }
  }
};

const getProfile = async (setUser, token) => {
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

const updateUser = async (formData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `http://localhost:3000/api/users/profile`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const changePassword = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `http://localhost:3000/api/users/change_password`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
export { registerUser, loginUser, getProfile, updateUser, changePassword };
