import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Productcard from "../components/Productcard";
import { fetchSearchProduct } from "../apis/ProductApi";
const SearchResult = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const keyword = new URLSearchParams(location.search).get("keyword");
  useEffect(() => {
    if (keyword) {
      fetchSearchProduct(setProducts, setError, keyword);
    }
  }, [keyword]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Kết quả tìm kiếm</h1>
      {error ? (
        <p className="text-red-500">Không tìm thấy kết quả</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Productcard key={product.product_id} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResult;
