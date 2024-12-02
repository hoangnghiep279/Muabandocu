import { useState } from "react";
import { addCategory } from "../../api/CategoryApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function AddCate() {
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addCategory(categoryName, setMessage);
    setCategoryName("");
    toast("Thêm sản phẩm thành công", { type: "success" });
    navigate("/admin/category");
  };
  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Thêm danh mục</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 items-center">
          <label htmlFor="categoryName" className="text-lg">
            Tên danh mục:
          </label>
          <input
            id="categoryName"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nhập tên loại sản phẩm"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primaryColor py-2 px-7 ml-[19%] rounded-md mt-3 text-white"
        >
          Thêm
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </main>
  );
}

export default AddCate;
