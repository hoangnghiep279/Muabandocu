import { useEffect, useState } from "react";
import { fetchProductsSeller } from "../apis/ProductApi";
import Productcard from "../components/Productcard";
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";

function ShopUser() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [quantity, setQuantity] = useState(0);
  const userId = new URLSearchParams(window.location.search).get("userId");

  useEffect(() => {
    fetchProductsSeller(setProducts, setQuantity, setTotalPages, page, userId);
  }, [page, userId]);

  const handlePageChange = (event) => {
    const selectedPage = parseInt(event.target.value, 10);
    setPage(selectedPage);
  };
  const sellerInfo = products[0] || {};

  return (
    <div className="container py-5">
      <div className="mt-5 seller_cover p-5 rounded-xl flex items-center gap-6 mb-12">
        <p className="border-4 w-28 h-28 border-[#ffffff63] rounded-full overflow-hidden">
          <img
            src={`http://localhost:3000/${sellerInfo.seller_avatar || ""}`}
            alt="Avatar người bán"
            className="w-full h-full object-contain"
          />
        </p>
        <div className="text-white">
          <p className="text-3xl  font-semibold">
            {sellerInfo.seller_name || "Chưa rõ"}
          </p>
          <a
            href={`${sellerInfo.linkzalo}`}
            className="my-2 block opacity-80 italic underline"
          >
            Link liên hệ
          </a>
          <p className="font-semibold ">Tổng số sản phẩm: {quantity}</p>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-14">Các sản phẩm của shop</h2>
        <div className="flex flex-wrap gap-7">
          {products.length > 0 ? (
            products.map((product) => (
              <Productcard key={product.id} product={product} />
            ))
          ) : (
            <p>Không có sản phẩm nào!</p>
          )}
        </div>
        <div className="flex justify-center items-center gap-1 mt-8">
          <button
            className="px-2 py-2 mx-2 bg-[#005d6312] rounded hover:bg-[#005c6338] border border-primaryColor hover:border"
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
          >
            <MdKeyboardDoubleArrowLeft />
          </button>
          <select
            className="border-2 px-3 py-1"
            value={page}
            onChange={handlePageChange}
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
          <button
            className="px-2 py-2 mx-2 bg-[#005d6312] rounded hover:bg-[#005c6338] border border-primaryColor hover:border"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages}
          >
            <MdKeyboardDoubleArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShopUser;
