import axios from "axios";

// hien san pham cần duyệt
const fetchPendingProducts = async (setProducts, setError) => {
  try {
    const response = await axios.get("http://localhost:3000/products/pending", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const sortedProducts = response.data.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    setProducts(sortedProducts);
  } catch (err) {
    setError("");
  }
};

// lấy chi tiết sản phẩm
const fetchProductDetail = async (setProduct, setLoading, id) => {
  try {
    const response = await axios.get(`http://localhost:3000/products/${id}`);

    setProduct(response.data.data);
    setLoading(false);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    setLoading(false);
  }
};
// Duyệt sản phẩm
const approveProduct = async (productId, setProducts, navigate) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/products/${productId}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      alert("Sản phẩm đã được duyệt thành công!");
    }
  } catch (err) {
    alert(err.response?.data?.message || "Không thể duyệt sản phẩm!");
  }
};

// từ chối sản phẩm
const handleRejectProduct = async (productId, setProducts) => {
  if (window.confirm("Bạn có chắc chắn muốn từ chối sản phẩm này?")) {
    try {
      await axios.delete(`http://localhost:3000/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );

      alert("Sản phẩm đã bị từ chối.");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi từ chối sản phẩm.");
    }
  }
};

export {
  fetchPendingProducts,
  fetchProductDetail,
  approveProduct,
  handleRejectProduct,
};
