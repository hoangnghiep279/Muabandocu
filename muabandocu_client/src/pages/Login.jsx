import Button from "../components/Button";
import Input from "../components/Input";
import { marketBg } from "../imgs";
const Login = () => {
  const labelStyle = "font-light opacity-80 text-lg my-2";
  return (
    <div className="h-screen flex font-vietnam ">
      <div className="w-1/2 h-screen">
        <img src={marketBg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col w-1/2 px-20 justify-center">
        <h2 className="text-3xl font-bold mb-8">Đăng nhập</h2>
        <label className={labelStyle}>Tài khoản</label>
        <Input placeholder="helloworld123" width="w-full" />
        <label className={`${labelStyle} mt-5`}>Mật khẩu</label>
        <Input placeholder="********" width="w-full" />
        <p className="text-end my-6 cursor-pointer text-blue-400">
          Forgot password?
        </p>
        <Button padding={"py-3"} width="w-full" text="text-base">
          Đăng nhập
        </Button>
      </div>
    </div>
  );
};

export default Login;
