import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import Input from "../components/Input";
import { marketBg } from "../imgs";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };
  const labelStyle = "font-light opacity-80 text-lg my-2";
  return (
    <div className="h-screen flex font-vietnam ">
      {/* Cmt 1 */}
      <div className="w-1/2 h-screen">
        <img src={marketBg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col w-1/2 px-20 justify-center">
        <h2 className="text-3xl font-bold mb-8">Đăng nhập</h2>
        <label className={labelStyle}>Tài khoản</label>
        <Input placeholder="helloworld123" width="w-full" type={"text"} />
        <div className="flex mt-5 items-center justify-between">
          <label className={`${labelStyle}`}>Mật khẩu</label>
          <button
            className="opacity-50 flex items-center gap-3"
            onClick={handleClickPassword}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />{" "}
            {showPassword ? "Hiện" : "Ẩn"}
          </button>
        </div>
        {/* hehe */}
        <Input
          placeholder="********"
          width="w-full"
          type={showPassword ? "password" : "text"}
        />
        <p className="text-end my-6 cursor-pointer text-blue-400">
          Forgot password?
        </p>
        <Button padding={"py-3"} width="w-full" text="text-base">
          Đăng nhập
        </Button>
        <div className="h-[1px] bg-[#181d1d] my-8 opacity-60 py"></div>
        <p className="flex justify-center items-center gap-1">
          {/* Cmm2  */}
          Bạn chưa có tài khoản?{" "}
          <NavLink to="/signin" className="text-blue-800 opacity-80">
            Đăng ký
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
