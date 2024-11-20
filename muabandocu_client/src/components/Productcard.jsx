import React from "react";
import { rate } from "../imgs";
import { NavLink } from "react-router-dom";
function Productcard({ product }) {
  return (
    <div className="font-manropew w-[370px] ">
      <div className="w-full h-[310px]">
        {product.image.length > 0 ? (
          <NavLink to={`/product/${product.id}`}>
            <img
              className="w-full h-full object-cover rounded-xl"
              src={`http://localhost:3000/${product.image[0]?.img_url}`} // Hiển thị ảnh đầu tiên
              alt={product.title}
            />
          </NavLink>
        ) : (
          <p className="text-center">Không có hình ảnh</p> // Xử lý nếu không có ảnh
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold w-full mt-3">{product.title}</h3>
        <div className="flex justify-between items-center my-3">
          <div className="flex items-center gap-2">
            <img src={rate} alt="" />
            <span className="text-lg font-light">5.0</span>
          </div>
          <p className="text-lg font-medium">{product.price}</p>
        </div>
        <button className="w-full border-[1px] border-[#005D63] py-3 text-lg font-medium rounded-md hover:bg-[#005D63] hover:border-transparent hover:text-white text-[#005D63]">
          Thêm giỏ hàng
        </button>
      </div>
    </div>
  );
}

export default Productcard;
