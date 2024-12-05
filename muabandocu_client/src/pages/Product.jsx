import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Productcard from "../components/Productcard";
import Loading from "../components/Loading";
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { fetchProductsCategory } from "../apis/ProductApi";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryName, setCategoryName] = useState("");
  const { categoryId } = useParams();

  useEffect(() => {
    // Lấy sản phẩm theo danh mục
    fetchProductsCategory(
      setProducts,
      setTotalPages,
      setLoading,
      page,
      categoryId
    );

    // Lấy tên danh mục
    const fetchCategoryName = async () => {
      try {
        if (categoryId) {
          const response = await axios.get(
            `http://localhost:3000/category/${categoryId}`
          );
          setCategoryName(
            response.data.data[0]?.name || "Danh mục không xác định"
          );
        } else {
          setCategoryName("Tất cả sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi khi lấy tên danh mục:", error);
        setCategoryName("Danh mục không xác định");
      }
    };

    fetchCategoryName();
  }, [categoryId, page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) return <Loading />;

  return (
    <main className="container py-9">
      <h2 className="text-5xl font-semibold text-center mb-10 text-primaryColor">
        {categoryName}
      </h2>
      <div className="flex flex-wrap gap-7">
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
        <span className="text-lg">{page}</span>
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
