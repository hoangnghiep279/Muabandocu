import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Productcard from "../components/Productcard";
const SearchResult = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // Lấy từ khóa từ query string
  const keyword = new URLSearchParams(location.search).get("keyword");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Giả sử API trả về dữ liệu dưới dạng bạn cung cấp
        const response = await axios.get(
          "http://localhost:3000/products/search",
          {
            params: { keyword },
          }
        );

        if (response.data.code === 200) {
          setProducts(response.data.data);
        } else {
          setError("Không tìm thấy sản phẩm.");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tìm kiếm sản phẩm.");
      }
    };

    if (keyword) {
      fetchProducts();
    }
  }, [keyword]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Kết quả tìm kiếm</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Productcard key={product.id} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResult;
