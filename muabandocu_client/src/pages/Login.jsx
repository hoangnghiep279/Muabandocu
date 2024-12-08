import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import Input from "../components/Input";
import { marketBg } from "../imgs";
import { Validation } from "../utils/Validation";
import { loginUser } from "../apis/UserApi";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [values, setValue] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValue((prevValues) => ({ ...prevValues, [name]: value }));

    if (isSubmitted) {
      setError((prevErrors) => ({
        ...prevErrors,
        [name]: Validation({ ...values, [name]: value }, [name])[name],
      }));
    }
  };

  const handleClickPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const validationErrors = Validation(values, ["email", "password"]);
    setError(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    loginUser(values, setError, navigate);
  };

  const labelStyle = "font-light opacity-80 text-lg my-2";

  return (
    <div className="h-screen flex font-vietnam">
      <div className="w-1/2 h-screen">
        <img src={marketBg} alt="" className="w-full h-full object-cover" />
      </div>

      <form
        onSubmit={handleLogin}
        className="flex flex-col w-1/2 px-20 justify-center"
      >
        <h2 className="text-3xl font-bold mb-8">Đăng nhập</h2>
        <label className={labelStyle}>Email</label>

        <Input
          placeholder="helloworld@gmail.com"
          width="w-full"
          type="text"
          name="email"
          onChange={handleInput}
        />
        {isSubmitted && error.email && (
          <p className="text-red-500 mt-2">{error.email}</p>
        )}
        <div className="flex mt-5 items-center justify-between">
          <label className={`${labelStyle}`}>Mật khẩu</label>
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
          placeholder="********"
          width="w-full"
          type={showPassword ? "text" : "password"}
          name={"password"}
          onChange={handleInput}
        />
        {isSubmitted && error.password && (
          <p className="text-red-500 mt-2">{error.password}</p>
        )}
        <p className="text-end my-6 cursor-pointer text-blue-400">
          Forgot password?
        </p>
        <button className="css_button w-full h-12" type="submit">
          Đăng nhập
        </button>
        <div className="h-[1px] bg-[#181d1d] my-8 opacity-60 py"></div>
        <p className="flex justify-center items-center gap-1">
          Bạn chưa có tài khoản?{" "}
          <NavLink to="/signin" className="text-blue-800 opacity-80">
            Đăng ký
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Login;
