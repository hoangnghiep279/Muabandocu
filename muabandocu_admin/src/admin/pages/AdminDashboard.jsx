import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import { fetchProducts } from "../api/ProductApi";
import { Link } from "react-router-dom";
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchProducts(setLoading, setProducts, setTotalPages, page);
  }, [page]);
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  if (loading) return <Loading />;
  return (
    <div>
      <div className="p-4 w-full mx-auto overflow-auto max-h-screen  ">
        <h1 className="text-2xl font-bold mb-4 ">
          Danh sách sản phẩm chờ duyệt
        </h1>
        {products.length > 0 ? (
          <div className="overflow-y-auto min-h-[450px]">
            <table className="table-auto w-full">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2">Tiêu đề</th>
                  <th className="px-4 py-2 w-32">Loại sản phẩm</th>
                  <th className="px-4 py-2">Giá</th>
                  <th className="px-4 py-2">Bảo hành</th>
                  <th className="px-4 py-2">Xem chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="px-4 border h-16">{product.title}</td>
                    <td className="px-4 border h-16 ">
                      <span className="display-dot">
                        {product.category_name}
                      </span>
                    </td>
                    <td className="px-4 border h-16 text-center">
                      {product.price} VNĐ
                    </td>

                    <td className="px-4 border h-16 first-letter:uppercase text-center">
                      {product.warranty}
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
    </div>
  );
}

export default AdminDashboard;
