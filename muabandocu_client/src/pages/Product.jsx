import Productcard from "../components/Productcard";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/products?page=${page}&limit=9`
        );
        setProducts(response.data.data);
        setTotalPages(response.data.pages);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) return <Loading />;
  return (
    <main className="container py-9">
      <h2 className="text-5xl font-semibold text-center mb-10 text-primaryColor">
        Tất cả sản phẩm
      </h2>
      <div className="flex flex-wrap gap-7 ">
        {products.length > 0 ? (
          products.map((product) => (
            <Productcard key={product.id} product={product} />
          ))
        ) : (
          <p>Không có sản phẩm nào!</p>
        )}
      </div>
      <div className="flex justify-center items-center gap-3 mt-8">
        <button
          className="px-2 py-2 mx-2 bg-[#005d6312] rounded hover:bg-[#005c6338] border border-primaryColor hover:border"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <MdKeyboardDoubleArrowLeft />
        </button>
        <span className="text-lg">{`${page} `}</span>
        <button
          className="px-2 py-2 mx-2 bg-[#005d6312] rounded hover:bg-[#005c6338] border border-primaryColor hover:border"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          <MdKeyboardDoubleArrowRight />
        </button>
      </div>
    </main>
  );
};
export default Product;
