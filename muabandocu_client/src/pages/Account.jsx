import React, { useState, useEffect } from "react";
import { Route, Routes, NavLink, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { FaRegUser } from "react-icons/fa6";
import { BsHandbag } from "react-icons/bs";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { MdOutlineShoppingBag } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import Profile from "../components/Profile";
import { getProfile } from "../apis/UserApi";
import ChangePassword from "../components/ChangePassword";
import UserProduct from "../components/UserProduct";
import UserPendingProduct from "../components/UserPendingProduct";
import AddProduct from "../components/AddProduct";
import Address from "../components/Address";
// import Notifications from "../components/Notifications";
import ConnectMomo from "../components/ConnectMomo";
import PendingOrder from "../components/PendingOrder";
import PrepareOrder from "../components/PrepareOrder";
import ShippingOrder from "../components/ShippingOrder";
import RecievedOrder from "../components/RecievedOrder";
import ManageMyOrder from "../components/ManageMyOrder";
import ProductOrder from "../components/ProductOrder";

function Account() {
  const [user, setUser] = useState(null);
  const [isMomoLinked, setIsMomoLinked] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Bạn chưa đăng nhập!");
        return;
      }

      getProfile(setUser, token);
    };

    fetchUserData();
  }, []);

  const handleLinkSuccess = () => {
    setIsMomoLinked(true);
    navigate("/account/addproduct");
  };
  const handleToggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <main className="font-manrope bg-[#F5F5F5] p-14">
      <div className="container flex">
        <section className="w-1/5">
          <div className="flex items-center gap-3">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={`http://localhost:3000/${user.avatar}`}
              alt=""
            />
            <p className="flex flex-col mt-1">
              <span className="font-semibold">{user.name}</span>
              <span className="text-xs">
                {new Date(user.create_at).toLocaleDateString("vi-VN")}
              </span>
            </p>
          </div>
          <ul className="flex flex-col gap-3 mt-8">
            <li>
              <span
                className="flex items-center gap-2 font-medium cursor-pointer"
                onClick={() => handleToggleMenu("account")}
              >
                <FaRegUser /> Tài khoản của tôi
              </span>
              <ul
                className={`text-sm ml-7 transition-all ${
                  openMenu === "account" ? "block" : "hidden"
                }`}
              >
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold block my-3 cursor-pointer"
                      : "my-3 block opacity-80 cursor-pointer"
                  }
                  to="profile"
                >
                  <li>Hồ sơ</li>
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold block my-3 cursor-pointer"
                      : "my-3 block opacity-80 cursor-pointer"
                  }
                  to="changePassword"
                >
                  <li>Đổi mật khẩu</li>
                </NavLink>
              </ul>
            </li>
            <li>
              <span
                className="flex items-center gap-2 font-medium cursor-pointer"
                onClick={() => handleToggleMenu("products")}
              >
                <BsHandbag /> Quản lý sản phẩm
              </span>
              <ul
                className={`text-sm ml-7 mt-3 transition-all ${
                  openMenu === "products" ? "block" : "hidden"
                }`}
              >
                <NavLink
                  to="userProduct"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold block my-3 cursor-pointer"
                      : "my-3 block opacity-80 cursor-pointer"
                  }
                >
                  <li>Sản phẩm của bạn</li>
                </NavLink>
                <NavLink
                  to="pendingproduct"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold block my-3 cursor-pointer"
                      : "my-3 block opacity-80 cursor-pointer"
                  }
                >
                  <li>Sản phẩm chờ duyệt</li>
                </NavLink>
                <NavLink
                  to="addproduct"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold block my-3 cursor-pointer"
                      : "my-3 block opacity-80 cursor-pointer"
                  }
                >
                  <li>Thêm sản phẩm</li>
                </NavLink>
              </ul>
            </li>

            <NavLink
              to="address"
              className={({ isActive }) =>
                isActive
                  ? "font-bold block  cursor-pointer"
                  : " block opacity-80 cursor-pointer"
              }
            >
              <li className="cursor-pointer">
                <span className="flex items-center gap-2 font-medium cursor-pointer">
                  <IoLocationOutline /> Địa chỉ
                </span>
              </li>
            </NavLink>
            <li className="cursor-pointer">
              <NavLink
                to={"pendingOrder"}
                className="flex items-center gap-2 font-medium cursor-pointer"
                onClick={() => handleToggleMenu("orders")}
              >
                <HiOutlineClipboardDocumentList /> Đơn mua
              </NavLink>
              <ul
                className={`text-sm ml-7 mt-3  duration-1000 ${
                  openMenu === "orders" ? "block" : "hidden"
                }`}
              >
                <NavLink
                  to="pendingOrder"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold block my-3 cursor-pointer"
                      : "my-3 block opacity-80 cursor-pointer"
                  }
                >
                  <li>Chờ duyệt</li>
                </NavLink>
                <NavLink
                  to="prepareOrder"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold block my-3 cursor-pointer"
                      : "my-3 block opacity-80 cursor-pointer"
                  }
                >
                  <li>Chờ lấy hàng</li>
                </NavLink>
                <NavLink
                  to="shippingOrder"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold block my-3 cursor-pointer"
                      : "my-3 block opacity-80 cursor-pointer"
                  }
                >
                  <li>Đang vận chuyển</li>
                </NavLink>
                <NavLink
                  to="receivedOrder"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold block my-3 cursor-pointer"
                      : "my-3 block opacity-80 cursor-pointer"
                  }
                >
                  <li>Đã nhận</li>
                </NavLink>
              </ul>
            </li>
            <li className="cursor-pointer">
              <NavLink
                to="manageMyorder"
                className="flex items-center gap-2 font-medium cursor-pointer"
                onClick={() => handleToggleMenu("manageMyorder")}
              >
                <MdOutlineShoppingBag /> Quản lý đơn đặt hàng
              </NavLink>
              <ul
                className={`text-sm ml-7 mt-3  duration-1000 ${
                  openMenu === "manageMyorder" ? "block" : "hidden"
                }`}
              >
                <NavLink
                  to="manageMyorder"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold block my-3 cursor-pointer"
                      : "my-3 block opacity-80 cursor-pointer"
                  }
                >
                  <li>Chờ duyệt</li>
                </NavLink>
                <NavLink
                  to="productOrder"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold block my-3 cursor-pointer"
                      : "my-3 block opacity-80 cursor-pointer"
                  }
                >
                  <li>Đơn hàng</li>
                </NavLink>
              </ul>
            </li>
          </ul>
        </section>

        {/* Main Content */}
        <section className="w-4/5 box-shadow px-6 pb-8">
          <Routes>
            <Route path="profile" element={<Profile user={user} />} />
            <Route
              path="changePassword"
              element={<ChangePassword user={user} />}
            />
            <Route path="userProduct" element={<UserProduct />} />
            <Route path="pendingproduct" element={<UserPendingProduct />} />
            <Route
              path="addproduct"
              element={isMomoLinked ? <ConnectMomo /> : <AddProduct />}
            />
            <Route path="address" element={<Address />} />

            <Route path="pendingOrder" element={<PendingOrder />} />
            <Route path="prepareOrder" element={<PrepareOrder />} />
            <Route path="shippingOrder" element={<ShippingOrder />} />
            <Route path="receivedOrder" element={<RecievedOrder />} />

            <Route path="manageMyorder" element={<ManageMyOrder />} />
            <Route path="productOrder" element={<ProductOrder />} />
            <Route path="*" element={<Profile user={user} />} />
          </Routes>
        </section>
      </div>
    </main>
  );
}

export default Account;
