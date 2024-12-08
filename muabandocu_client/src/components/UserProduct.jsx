import React, { useState, useEffect } from "react";
import { fetchProductsApproved, deleteProduct } from "../apis/ProductApi";
import { IoArrowForwardOutline, IoArrowBackSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const UserPendingProduct = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProductsApproved(setProducts, setTotalPages, page);
  }, [page]);

  const handlePageChange = (event) => {
    const selectedPage = parseInt(event.target.value, 10);
    setPage(selectedPage);
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này không?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await deleteProduct(productId, token);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      alert("Xóa sản phẩm thành công!");
    } catch (error) {
      alert(error.message || "Xóa sản phẩm thất bại!");
    }
  };
  return (
    <div className="p-4">
      <h2 className="text-xl text-center mb-4">Danh sách sản phẩm</h2>
      {products.length > 0 && (
        <div className="flex justify-end mb-3 gap-1 items-center">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <IoArrowBackSharp />
          </button>
          <select
            className="border px-1"
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
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            <IoArrowForwardOutline />
          </button>
        </div>
      )}
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id} className="w-full h-28 border flex">
              <div className="w-28 h-28 p-2">
                <Link to={`/product/${product.product_id || product.id}`}>
                  <img
                    className="w-full h-full object-cover"
                    src={`http://localhost:3000/${product.images[0]}`}
                    alt="Product"
                  />
                </Link>
              </div>
              <div className="border-l ml-4 p-2 flex-grow h-full flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <div>
                    <Link to={`/product/${product.product_id || product.id}`}>
                      <h3 className="font-semibold tracking-wider text-lg">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="opacity-80 mt-2">{product.price} đ</p>
                  </div>
                  <p className="self-start">
                    Phí ship:{" "}
                    <span className="opacity-80">{product.shipfee} đ</span>
                  </p>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <p>Loại sản phẩm: {product.category_name}</p>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-purple-700 "
                  >
                    Xóa sản phẩm
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có sản phẩm nào</p>
      )}
    </div>
  );
};

export default UserPendingProduct;
