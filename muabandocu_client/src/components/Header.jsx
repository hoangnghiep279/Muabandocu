import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { search, cart, profile, arrowUp } from "../imgs";
import Button from "./Button";
import { IoNotificationsOutline } from "react-icons/io5";
const Header = () => {
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");
  const [login, setLogin] = useState(false);
  const [displayDropdown, setDisplayDropdown] = useState("hidden");

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi render lại trang
    const token = localStorage.getItem("token");
    if (token) {
      setLogin(true);
    }
  }, []);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      setError("Vui lòng nhập từ khóa tìm kiếm.");
      return;
    }
    setError("");
    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
  };
  const handleDropdown = (display) => {
    setDisplayDropdown(display);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogin(false);
  };

  return (
    <header className="bg-primaryColor">
      {/* col-1 */}
      <div className="container flex gap-10 py-7 justify-between text-white">
        <NavLink
          to={"/"}
          className="text-2xl font-bold font-slab cursor-pointer"
        >
          OLD-STORE
        </NavLink>
        {/* col-2 */}
        <div className="flex flex-col gap-7 items-center font-manrope">
          <div className="min-w-[700px] max-w-3xl h-11">
            <form
              onSubmit={handleSearch}
              className="w-full h-full border-[1px] justify-between flex"
            >
              <input
                className="default-input w-full px-2"
                placeholder="Tìm kiếm sản phẩm"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#FFD44D] block ml-3 flex-center px-3"
              >
                <img src={search} alt="" />
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          </div>
          <nav>
            <ul className="flex">
              <li className="text-white py-1 px-8">
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "font-bold" : "")}
                >
                  Trang chủ
                </NavLink>
              </li>
              <li className="text-white py-1 px-8">
                <NavLink
                  to="/product"
                  className={({ isActive }) => (isActive ? "font-bold" : "")}
                >
                  Sản phẩm
                </NavLink>
              </li>
              <li className="text-white py-1 px-8">
                <NavLink
                  to="/contact"
                  className={({ isActive }) => (isActive ? "font-bold" : "")}
                >
                  Liên hệ
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        {/* col 3 */}
        {login ? (
          <div className="mt-2">
            <div className="flex items-center gap-4 font-manrope">
              <div className="flex text-white text-3xl mt-1">
                <IoNotificationsOutline />
              </div>
              <div className="flex text-white ">
                <img src={cart} alt="" />
                <span>(0)</span>
              </div>

              <div className="relative mb-[-20px]">
                <img
                  src={profile}
                  alt=""
                  className="pb-5"
                  onMouseEnter={() => handleDropdown("block")}
                  onMouseLeave={() => handleDropdown("hidden")}
                />
                <div
                  className={`${displayDropdown}`}
                  onMouseEnter={() => handleDropdown("block")}
                  onMouseLeave={() => handleDropdown("hidden")}
                >
                  <div className="absolute top-8">
                    <img src={arrowUp} alt="" />
                  </div>
                  <div className="absolute p-3 w-40 rounded-md bg-white top-10 right-[-70px] z-20">
                    <ul>
                      <li>
                        <NavLink
                          to={"/account"}
                          className="block py-2 text-primaryColor font-semibold"
                        >
                          Tài khoản của tôi
                        </NavLink>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block py-2 text-primaryColor font-semibold"
                        >
                          Đơn mua
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block py-2 text-primaryColor font-semibold"
                          onClick={handleLogout}
                        >
                          Đăng xuất
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button text="text-sm" padding={"py-3 px-3"}>
              <NavLink to="/login">Đăng nhập</NavLink>
            </Button>
            <Button text="text-sm" padding={"py-3 px-5"}>
              <NavLink to="/signin">Đăng ký</NavLink>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
