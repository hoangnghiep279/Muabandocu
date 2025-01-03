import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import Input from "../components/Input";
import { marketBg } from "../imgs";
import { Validation } from "../utils/Validation";
import { registerUser } from "../apis/UserApi";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [values, setValue] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;

    setValue({ ...values, [name]: value });

    if (isSubmitted) {
      setError(Validation({ ...values, [name]: value }, [name]));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const validationErrors = Validation(values, [
      "name",
      "email",
      "password",
      "confirmPassword",
    ]);
    setError(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Thực hiện đăng ký
    registerUser(values, setError, navigate);
  };

  const handleClickPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const labelStyle = "font-light opacity-80 text-lg my-2";

  return (
    <div className="h-screen flex font-vietnam ">
      <div className="w-1/2 h-screen">
        <img src={marketBg} alt="" className="w-full h-full object-cover" />
      </div>

      <form
        className="flex flex-col w-1/2 px-20 justify-center"
        onSubmit={handleRegister}
      >
        <h2 className="text-3xl font-bold mb-8">Đăng ký tài khoản</h2>

        {/* Tên người dùng */}
        <label className={labelStyle}>Tên người dùng</label>
        <Input
          placeholder="Trịnh Trần Phương Tuấn"
          width="w-full"
          type="text"
          name="name"
          onChange={handleInput}
        />
        {isSubmitted && error.name && (
          <p className="text-red-500 mt-2">{error.name}</p>
        )}

        {/* Email */}
        <label className={labelStyle}>Email</label>
        <Input
          placeholder="helloworld123@gmail.com"
          width="w-full"
          type="text"
          name="email"
          onChange={handleInput}
        />
        {isSubmitted && error.email && (
          <p className="text-red-500 mt-2">{error.email}</p>
        )}

        {/* Mật khẩu */}
        <div className="flex mt-5 items-center justify-between">
          <label className={labelStyle}>Mật khẩu</label>
          <button
            type="button"
            className="opacity-50 flex items-center gap-3"
            onClick={handleClickPassword}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />{" "}
            {showPassword ? "Ẩn" : "Hiện"}
          </button>
        </div>
        <Input
          placeholder="**********"
          width="w-full"
          name="password"
          onChange={handleInput}
          type={showPassword ? "text" : "password"}
        />
        {isSubmitted && error.password && (
          <p className="text-red-500 mt-2">{error.password}</p>
        )}

        {/* Xác nhận mật khẩu */}
        <label className={labelStyle}>Xác nhận mật khẩu</label>
        <Input
          placeholder="**********"
          width="w-full"
          name="confirmPassword"
          onChange={handleInput}
          type={showPassword ? "text" : "password"}
        />
        {isSubmitted && error.confirmPassword && (
          <p className="text-red-500 mt-2">{error.confirmPassword}</p>
        )}

        <div className="my-3"></div>
        <button className="css_button h-11 w-full" type="submit">
          Đăng ký
        </button>
        <div className="h-[1px] bg-[#181d1d] my-8 opacity-60"></div>
        <p className="flex justify-center items-center gap-1">
          Bạn đã có tài khoản?{" "}
          <NavLink to="/login" className="text-blue-800 opacity-80">
            Đăng nhập
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Signin;
