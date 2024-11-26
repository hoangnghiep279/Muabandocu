import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPendingProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/products/pending",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Token từ login
            },
          }
        );
        setProducts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải sản phẩm!");
      }
    };

    fetchPendingProducts();
  }, []);

  const approveProduct = async (productId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/products/${productId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
        alert("Sản phẩm đã được duyệt thành công!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Không thể duyệt sản phẩm!");
    }
  };

  return (
    <>
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Danh sách sản phẩm chờ duyệt
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        {products.length > 0 ? (
          <table className="table-auto w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Tiêu đề</th>
                <th className="px-4 py-2">Mô tả</th>
                <th className="px-4 py-2">Giá</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-t border-b">
                    {product.title}
                  </td>
                  <td className="px-4 py-2 border-t border-b">
                    {product.description}
                  </td>
                  <td className="px-4 py-2 border-t border-b">
                    {product.price} VNĐ
                  </td>
                  <td className="px-4 py-2 border-t border-b">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => approveProduct(product.id)}
                    >
                      Duyệt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có sản phẩm nào đang chờ duyệt.</p>
        )}
      </div>
    </>
  );
}

export default Home;
