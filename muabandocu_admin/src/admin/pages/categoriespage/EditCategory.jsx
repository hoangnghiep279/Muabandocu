import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategoryById, UpdateCategory } from "../../api/CategoryApi";
import { toast } from "react-toastify";
function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getCategoryById(id, setCategoryName, setMessage);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await UpdateCategory(id, categoryName, setMessage);
    toast("Sửa sản phẩm thành công", { type: "success" });
    navigate("/admin/category");
  };

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Chỉnh sửa danh mục</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 items-center">
          <label htmlFor="categoryName" className="text-lg">
            Tên danh mục:
          </label>
          <input
            className="border border-gray-300 p-2 rounded-md"
            id="categoryName"
            type="text"
            value={categoryName || ""}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primaryColor py-2 px-7 ml-[19%] rounded-md mt-3 text-white"
        >
          Cập nhật
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 ${
            message.includes("thành công") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </main>
  );
}

export default EditCategory;
