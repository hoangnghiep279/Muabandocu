import React from "react";
import { rate } from "../imgs";
import { NavLink, useNavigate } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import { addCartItem } from "../apis/cartitemApi";

function Productcard({ product }) {
  const hasImages = product.images && product.images.length > 0;
  const navigate = useNavigate();
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      navigate("/login"); // Chuyển hướng đến trang đăng nhập
      return;
    }

    const result = await addCartItem(product);
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };
  return (
    <div className="font-manropew w-[370px]">
      <div className="w-full h-[310px] rounded-t-xl overflow-hidden">
        {hasImages ? (
          <NavLink to={`/product/${product.product_id || product.id}`}>
            <img
              className="w-full h-full object-cover hover:scale-105 transition duration-300 ease-in-out"
              src={`http://localhost:3000/${product.images[0]}`}
              alt={product.title}
            />
          </NavLink>
        ) : (
          <p className="text-center">Không có hình ảnh</p>
        )}
      </div>
      <div className="box-shadow p-3">
        <NavLink to={`/product/${product.product_id || product.id}`}>
          <h3 className="text-xl font-semibold w-full mt-4">{product.title}</h3>
        </NavLink>
        <p className="text-right my-3">{product.category_name}</p>
        <div className="flex justify-between items-center my-4">
          <div className="flex items-center gap-2">
            <img src={rate} alt="" />
            <span className="text-lg font-light">5.0</span>
          </div>
          <p className="text-lg font-medium">
            {Number(product.price).toLocaleString("vi-VN")}đ
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full border bg-[#005d6312] border-primaryColor py-2 px-5 text-primaryColor flex-center gap-2 text-lg hover:opacity-90"
        >
          <BsCartPlus /> Thêm giỏ hàng
        </button>
      </div>
    </div>
  );
}

export default Productcard;
