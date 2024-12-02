import axios from "axios";
import { toast } from "react-toastify";

// manager
const fetchManager = async (setManager, setLoading) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/users/manager",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setManager(response.data.data);
    setLoading(false);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh sách:", error);
    setLoading(false);
  }
};
const fetchUser = async (setUser, setLoading) => {
  try {
    const response = await axios.get("http://localhost:3000/api/users/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setUser(response.data.data);
    setLoading(false);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh sách:", error);
    setLoading(false);
  }
};
const addManager = async (values, navigate) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/users/registerManager",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(values),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Đã xảy ra lỗi");
    }

    toast("Thêm quản lý thành công", { type: "success" });
    navigate("/admin/managerAccount");
  } catch (error) {
    toast("Có lỗi xảy ra khi thêm quản lý: " + error.message, {
      type: "error",
    });
  }
};
const DeleteUser = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.ok) {
      toast("Xóa quản lý thành công", { type: "success" });
    } else {
      throw new Error(result.message || "Lỗi khi xóa quản lý");
    }
  } catch (error) {
    toast(error.message || "Lỗi không xác định khi xóa danh mục", {
      type: "error",
    });
  }
};

export { fetchManager, fetchUser, addManager, DeleteUser };
