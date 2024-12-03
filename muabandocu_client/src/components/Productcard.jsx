import React from "react";
import { rate } from "../imgs";
import { NavLink } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
function Productcard({ product }) {
  return (
    <div className="font-manropew w-[370px]">
      <div className="w-full h-[310px] rounded-t-xl overflow-hidden">
        {product.image.length > 0 ? (
          <NavLink to={`/product/${product.product_id || product.id}`}>
            <img
              className="w-full h-full object-cover  hover:scale-105 transition duration-300 ease-in-out"
              src={`http://localhost:3000/${product.image[0]?.img_url}`}
              alt={product.title}
            />
          </NavLink>
        ) : (
          <p className="text-center">Không có hình ảnh</p> // Xử lý nếu không có ảnh
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
          <p className="text-lg font-medium">{product.price} đ</p>
        </div>
        <button className="w-full border bg-[#005d6312] border-primaryColor py-2 px-5 text-primaryColor flex-center gap-2 text-lg hover:opacity-90">
          <BsCartPlus /> Thêm giỏ hàng
        </button>
      </div>
    </div>
  );
}

export default Productcard;
