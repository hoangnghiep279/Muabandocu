import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/Validation";
import {
  fetchPendingProducts,
  approveProduct,
  handleRejectProduct,
} from "../api/ProductApi";
function ManagerDashboard() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPendingProducts(setProducts, setError);
  }, []);
  const handleApprove = (productId) => {
    approveProduct(productId, setProducts);
  };

  const handleReject = (productId) => {
    handleRejectProduct(productId, setProducts);
  };

  return (
    <>
      <div className="p-4 w-full mx-auto overflow-auto max-h-screen  ">
        <h1 className="text-2xl font-bold mb-4 ">
          Danh sách sản phẩm chờ duyệt
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        {products.length > 0 ? (
          <div className="overflow-y-auto max-h-[calc(100vh-85px)]">
            <table className="table-auto w-full">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2">Tiêu đề</th>
                  <th className="px-4 py-2 w-32">Mô tả</th>
                  <th className="px-4 py-2">Giá</th>
                  <th className="px-4 py-2">Ngày đăng bài</th>
                  <th className="px-4 py-2">Hành động</th>
                  <th className="px-4 py-2">Xem chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="px-4 border h-16">{product.title}</td>
                    <td className="px-4 border h-16 w-32">
                      <span className="display-dot">{product.description}</span>
                    </td>
                    <td className="px-4 border h-16">{product.price} VNĐ</td>
                    <td className="px-4 border h-16">
                      {formatDate(product.created_at)}
                    </td>
                    <td className="px-4 border h-16">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleApprove(product.id)}
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(product.id)}
                        className="bg-red-500 ml-2 hover:bg-red-700 whitespace-nowrap text-white py-2 px-4 rounded"
                      >
                        Từ chối
                      </button>
                    </td>
                    <td className="px-4 border h-16 text-center">
                      <Link
                        className="text-blue-500 hover:underline text-lg"
                        to={`product/${product.id}`}
                      >
                        Xem
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Không có sản phẩm nào đang chờ duyệt.</p>
        )}
      </div>
    </>
  );
}

export default ManagerDashboard;
