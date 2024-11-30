import React, { useEffect, useState } from "react";
import { fetchCategories } from "../../api/CategoryApi";
import Loading from "../../../components/Loading";
import { Link } from "react-router-dom";
function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchCategories(setCategories, setLoading);
  }, []);
  if (loading) return <Loading />;
  return (
    <main className="p-5">
      <h1 className="text-2xl font-bold mb-4 "> Danh sách loại sản phẩm</h1>
      <table className="table-auto">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 border">Tiêu đề</th>
            <th className="px-4 py-2 border">Sửa loại sản phẩm</th>
            <th className="px-4 py-2 border">Xóa loại sản phẩm</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="border px-4 py-2">{category.name}</td>

              <td className="border px-4 py-2 text-center text-blue-600">
                Sửa
              </td>
              <td className="border px-4 py-2 text-center text-blue-600">
                Xóa
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/admin/category/add">
        <button className="bg-primaryColor hover:bg-opacity-90 text-white font-bold py-2 px-4 mt-4">
          Thêm loại sản phẩm
        </button>
      </Link>
    </main>
  );
}

export default Category;
