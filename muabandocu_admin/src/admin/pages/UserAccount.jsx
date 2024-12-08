import React, { useEffect, useState } from "react";
import { fetchUser, DeleteUser } from "../api/Userapi";
import Loading from "../../components/Loading";
import { formatDate } from "../../utils/Validation";
import { Link } from "react-router-dom";
function UserAccount() {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchUser(setUser, setLoading);
  }, []);
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
      await DeleteUser(id);
      fetchUser(setUser, setLoading);
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
            <th className="px-4 py-2 border">Ảnh đại diện</th>
            <th className="px-4 py-2 border">Giới tính</th>
            <th className="px-4 py-2 border">Ngày tạo</th>
            <th className="px-4 py-2 border">Xóa loại sản phẩm</th>
          </tr>
        </thead>
        <tbody>
          {user.map((u) => (
            <tr key={u.id}>
              <td className="border px-4 py-2">{u.id}</td>
              <td className="border px-4 py-2">{u.name}</td>
              <td className="border px-4 py-2">
                <div className="w-8 h-8 rounded-full border flex-center overflow-hidden">
                  <img
                    className="w-full h-w-full object-cover"
                    src={`http://localhost:3000/${u.avatar}`}
                    alt=""
                  />
                </div>
              </td>
              <td className="border px-4 py-2">
                {u.gender === 1 ? "Nam" : u.gender === 2 ? "Nu" : "Chưa thêm"}
              </td>
              <td className="border px-4 py-2">{formatDate(u.create_at)}</td>

              <td
                className="border px-4 py-2 text-center text-blue-600 cursor-pointer"
                onClick={() => handleDelete(u.id)}
              >
                Xóa
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default UserAccount;
