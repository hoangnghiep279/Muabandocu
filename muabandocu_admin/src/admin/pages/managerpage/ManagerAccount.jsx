import React, { useEffect, useState } from "react";
import { DeleteUser, fetchManager } from "../../api/Userapi";
import Loading from "../../../components/Loading";
import { formatDate } from "../../../utils/Validation";
import { Link } from "react-router-dom";
function ManagerAccount() {
  const [manager, setManager] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchManager(setManager, setLoading);
  }, []);
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
      await DeleteUser(id);
      fetchManager(setManager, setLoading);
    }
  };
  if (loading) return <Loading />;
  return (
    <main className="p-5 h-screen overflow-auto">
      <h1 className="text-2xl font-bold mb-4 "> Danh sách loại sản phẩm</h1>
      <table className="table-auto">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Tên</th>
            <th className="px-4 py-2 border">Ngày tạo</th>
            <th className="px-4 py-2 border">Xóa loại sản phẩm</th>
          </tr>
        </thead>
        <tbody>
          {manager.map((mgr) => (
            <tr key={mgr.id}>
              <td className="border px-4 py-2">{mgr.id}</td>
              <td className="border px-4 py-2">{mgr.name}</td>
              <td className="border px-4 py-2">{formatDate(mgr.create_at)}</td>

              <td
                className="border px-4 py-2 text-center text-blue-600 cursor-pointer"
                onClick={() => handleDelete(mgr.id)}
              >
                Xóa
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/admin/managerAccount/add">
        <button className="bg-primaryColor hover:bg-opacity-90 text-white font-bold py-2 px-4 mt-4">
          Thêm nhân viên
        </button>
      </Link>
    </main>
  );
}

export default ManagerAccount;
