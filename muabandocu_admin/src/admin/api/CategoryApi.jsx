import axios from "axios";

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

export { fetchCategories, addCategory };
