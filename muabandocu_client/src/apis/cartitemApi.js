import axios from "axios";
import { toast } from "react-toastify";

const fetchCartItems = async (
  setCartItems,
  setTotalItem,
  setTotalPages,
  token,
  page
) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/cartitem?page=${page}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setTotalItem(response.data.totalItems);
    setCartItems(response.data.cartItems);
    setTotalPages(response.data.pages);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm trong giỏ hàng:", error);
  }
};
const getTotal = async (setTotal, token) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/cartitem?page=1&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const cartItems = response.data.cartItems || [];
    // Lọc các mục có approved !== 2
    const validCartItems = cartItems.filter((item) => item.approved !== 2);
    // Tính tổng số lượng từ các mục hợp lệ
    const total = validCartItems.reduce(
      (sum, item) => sum + item.cart_quantity,
      0
    );

    setTotal(total);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm trong giỏ hàng:", error);
  }
};
const addCartItem = async (product) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:3000/cartitem",
      {
        product_id: product.product_id || product.id,
        quantity: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);

    toast(response.data.message, { type: response.data.typeToast });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    alert(
      error.response?.data?.message ||
        "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng."
    );
  }
};

const deleteCartItem = async (id, token) => {
  try {
    if (!token) {
      console.error("Token không tồn tại. Vui lòng đăng nhập lại.");
      return;
    }

    const response = await axios.delete(
      `http://localhost:3000/cartitem/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Xóa sản phẩm thành công:", response.data.message);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi xóa sản phẩm:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};
export { getTotal, fetchCartItems, addCartItem, deleteCartItem };
