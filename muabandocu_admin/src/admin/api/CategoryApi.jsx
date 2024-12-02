import axios from "axios";
import { toast } from "react-toastify";

const fetchCategories = async (setCategories, setLoading) => {
  try {
    const response = await axios.get("http://localhost:3000/category");
    setCategories(response.data.data);
    setLoading(false);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh sách:", error);
    setLoading(false);
  }
};

const addCategory = async (categoryName, setMessage) => {
  try {
    const response = await fetch("http://localhost:3000/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: categoryName }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Đã xảy ra lỗi");
    }

    setMessage(result.message);
  } catch (error) {
    setMessage(error.message);
  }
};
const getCategoryById = async (id, setCategoryName, setMessage) => {
  try {
    const response = await fetch(`http://localhost:3000/category/${id}`);
    const result = await response.json();

    if (response.ok) {
      if (Array.isArray(result.data) && result.data.length > 0) {
        setCategoryName(result.data[0].name || "");
      } else {
        throw new Error("Không tìm thấy danh mục");
      }
    } else {
      throw new Error(result.message || "Lỗi khi tải danh mục");
    }
  } catch (error) {
    setMessage(error.message || "Lỗi không xác định");
    setCategoryName("");
  }
};

const UpdateCategory = async (id, categoryName, setMessage) => {
  try {
    const response = await fetch(`http://localhost:3000/category/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: categoryName }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Không thể cập nhật danh mục");
    }

    setMessage("Cập nhật danh mục thành công!");
  } catch (error) {
    setMessage(error.message || "Lỗi không xác định khi cập nhật danh mục");
  }
};

const DeleteCategory = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/category/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const result = await response.json();

    if (response.ok) {
      toast("Xóa danh mục thành công", { type: "success" });
    } else {
      throw new Error(result.message || "Lỗi khi xóa danh mục");
    }
  } catch (error) {
    toast(error.message || "Lỗi không xác định khi xóa danh mục", {
      type: "success",
    });
  }
};
export {
  fetchCategories,
  addCategory,
  UpdateCategory,
  getCategoryById,
  DeleteCategory,
};
