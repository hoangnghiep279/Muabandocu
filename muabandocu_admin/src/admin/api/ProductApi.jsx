import axios from "axios";
const fetchProducts = async (setLoading, setProducts, setTotalPages, page) => {
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

const fetchProductDetail = async (id, setProduct, setLoading) => {
  try {
    const response = await axios.get(`http://localhost:3000/products/${id}`);

    setProduct(response.data.data);
    setLoading(false);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    setLoading(false);
  }
};

export { fetchProducts, fetchProductDetail };
