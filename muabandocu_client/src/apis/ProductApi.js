import axios from "axios";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

//BREADCRUMB
const fetchProductTitle = async (setProductTitle, id) => {
  try {
    const response = await axios.get(`http://localhost:3000/products/${id}`);
    setProductTitle(response.data.data.title);
  } catch (error) {
    console.error("Lỗi khi lấy tên sản phẩm:", error);
  }
};

//TRANG SẢN PHẨM CHI TIẾT
const fetchProductDetail = async (
  setProduct,
  setMainImg,
  setDescription,
  MAX_LINES,
  setLoading,
  id
) => {
  try {
    const response = await axios.get(`http://localhost:3000/products/${id}`);

    setProduct(response.data.data);
    setMainImg("http://localhost:3000/" + response.data.data.images[0]);
    const description = response.data.data.description
      ? response.data.data.description
          .split("\n")
          .slice(0, MAX_LINES)
          .join("\n")
      : "Không có mô tả cho sản phẩm này.";
    setDescription(description);
    setLoading(false);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    setLoading(false);
  }
};

//HOME
const fetchProducts = async (setProducts, setTotalPages, setLoading, page) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `http://localhost:3000/products?page=${page}&limit=6`
    );
    setProducts(response.data.data);
    setTotalPages(response.data.pages);
    setLoading(false);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    setLoading(false);
  }
};

//TRANG PRODUCT
const fetchProductsCategory = async (
  setProducts,
  setTotalPages,
  setLoading,
  page,
  categoryId
) => {
  setLoading(true);
  try {
    const response = await axios.get("http://localhost:3000/products", {
      params: {
        page,
        limit: 9,
        categoryId,
      },
    });

    setProducts(response.data.data || []);
    setTotalPages(response.data.pages || 1);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    setProducts([]);
    setTotalPages(1);
  } finally {
    setLoading(false);
  }
};

//TÌM KIẾM SẢN PHẨM
const fetchSearchProduct = async (setProducts, setError, keyword) => {
  try {
    const response = await axios.get("http://localhost:3000/products/search", {
      params: { keyword },
    });

    if (response.data.code === 200) {
      setProducts(response.data.data);
    } else {
      setError("Không tìm thấy sản phẩm.");
    }
  } catch (err) {
    console.error("Lỗi fetch:", err);
    setError("Đã xảy ra lỗi khi tìm kiếm sản phẩm.");
  }
};

// Lấy sản phẩm đã duyệt
const fetchProductsApproved = async (
  setProducts,
  setTotalPages,
  page,
  token
) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/products/user-products?page=${page}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setProducts(response.data.data);
    setTotalPages(response.data.pages);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
  }
};
// Lấy sản phẩm và thông tin người bán
const fetchProductsSeller = async (
  setProducts,
  setQuantity,
  setTotalPages,
  page,
  userId
) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/products/user-products/${userId}?page=${page}&limit=6`
    );
    setQuantity(response.data.total);

    setProducts(response.data.data);
    setTotalPages(response.data.pages);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
  }
};

// lay san pham cho duyệt
const fetchPendingProducts = async (setProducts, setTotalPages, page) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `http://localhost:3000/products/user-pendingproducts?page=${page}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setProducts(response.data.data);
    setTotalPages(response.data.pages);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
  }
};

// thêm sản phẩm
const fetchAddProduct = async (
  formData,
  files,
  setFormData,
  setFiles,
  setMessage,
  setErrors
) => {
  try {
    const token = localStorage.getItem("token");
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => form.append(key, value));
    Array.from(files).forEach((file) => form.append("images", file));

    const res = await axios.post("http://localhost:3000/products", form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMessage(res.data.message || "Thêm sản phẩm thành công!");
    setFormData({
      title: "",
      categoryId: "",
      price: "",
      description: "",
      linkzalo: "",
      warranty: "",
      shipfee: "",
    });
    setFiles([]);
    setErrors({});
    toast("thêm sản phẩm thành công", { type: "success" });
  } catch (err) {
    setMessage(err.response?.data?.message || "Đã xảy ra lỗi!");
    toast("thêm sản phẩm thất bại", { type: "error" });
  }
};
const updateProduct = async (productId, updatedData, token) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/products/${productId}`,
      updatedData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

const deleteProduct = async (productId, token) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/products/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    throw error.response?.data || "Đã xảy ra lỗi!";
  }
};

export {
  fetchProducts,
  fetchProductsCategory,
  fetchProductTitle,
  fetchProductDetail,
  fetchSearchProduct,
  fetchProductsApproved,
  fetchProductsSeller,
  fetchPendingProducts,
  fetchAddProduct,
  updateProduct,
  deleteProduct,
};
