import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { search, cart, profile, arrowUp } from "../imgs";
import axios from "axios";
import { IoNotificationsOutline } from "react-icons/io5";
import { SlArrowDown } from "react-icons/sl";
const Header = () => {
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");
  const [login, setLogin] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productDropdown, setProductDropdown] = useState("hidden");
  const [profileDropdown, setProfileDropdown] = useState("hidden");
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLogin(true);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      setError("Vui lòng nhập từ khóa tìm kiếm.");
      return;
    }
    setError("");
    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/category");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh sách:", error);
      }
    };

    fetchCategories();
  }, []);
  const handleDropdownprofile = (display) => {
    setProfileDropdown(display);
  };
  const handleDropdownproduct = (display) => {
    setProductDropdown(display);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
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
              <li className="relative py-1 px-8">
                <span
                  onMouseEnter={() => handleDropdownproduct("block")}
                  onMouseLeave={() => handleDropdownproduct("hidden")}
                  className="cursor-pointer flex items-center pb-3"
                >
                  Sản phẩm <SlArrowDown className="ml-2 text-sm" />
                </span>
                <div
                  className={`${productDropdown} absolute top-8 left-0 bg-white rounded-lg overflow-hidden text-black w-48 shadow-lg z-10`}
                  onMouseEnter={() => handleDropdownproduct("block")}
                  onMouseLeave={() => handleDropdownproduct("hidden")}
                >
                  <ul>
                    {categories.map((category) => (
                      <li
                        key={category.id}
                        className="px-4 py-2 hover:bg-gray-200"
                      >
                        <NavLink
                          to={`/product/category/${category.id}`}
                          className="block"
                        >
                          {category.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
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
                  onMouseEnter={() => handleDropdownprofile("block")}
                  onMouseLeave={() => handleDropdownprofile("hidden")}
                />
                <div
                  className={`${profileDropdown}`}
                  onMouseEnter={() => handleDropdownprofile("block")}
                  onMouseLeave={() => handleDropdownprofile("hidden")}
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
            <button className="text-sm css_button h-11 w-28">
              <NavLink to="/login">Đăng nhập</NavLink>
            </button>
            <button className="text-sm css_button h-11 w-28">
              <NavLink to="/signin">Đăng ký</NavLink>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
