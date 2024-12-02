import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { Validation } from "../utils/Validation";
import { toast } from "react-toastify";
function Login() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [values, setValue] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const permission = localStorage.getItem("permission");
      if (permission === "1") {
        navigate("/admin");
      } else if (permission === "2") {
        navigate("/manager");
      }
    }
  }, [navigate]);
  const handleInput = (e) => {
    const { name, value } = e.target;
    setValue({ ...values, [name]: value });

    if (isSubmitted) {
      setError(Validation({ ...values, [name]: value }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const validationErrors = Validation(values);
    setError(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          email: values.email,
          password: values.password,
        }
      );

      if (response && response.data.data) {
        const { token, permission } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("permission", permission);

        toast("Đăng nhập thành công", { type: "success" });

        if (permission === 1) {
          navigate("/admin");
          window.location.reload();
        } else if (permission === 2) {
          navigate("/manager");
          window.location.reload();
        }
      } else {
        toast("Thông tin đăng nhập không hợp lệ", { type: "error" });
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast(error.response.data.message, { type: "error" });
        setError({ serverError: error.response.data.message });
      } else {
        toast("Đăng nhập thất bại", { type: "error" });
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-3xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              name="email"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="email"
              onChange={handleInput}
              placeholder="Username"
            />
            {isSubmitted && error.email && (
              <p className="text-red-500 mt-2">{error.email}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="******************"
              name={"password"}
              onChange={handleInput}
            />
            {isSubmitted && error.email && (
              <p className="text-red-500 mt-2">{error.email}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >
              Forgot Password
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
