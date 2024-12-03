import axios from "axios";

const fetchProductTitle = async (setProductTitle, id) => {
  try {
    const response = await axios.get(`http://localhost:3000/products/${id}`);
    setProductTitle(response.data.data.title);
  } catch (error) {
    console.error("Lỗi khi lấy tên sản phẩm:", error);
  }
}; //BREADCRUMB

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
    setDescription(
      response.data.data.description.split("\n").slice(0, MAX_LINES).join("\n")
    );
    setLoading(false);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    setLoading(false);
  }
}; //TRANG SẢN PHẨM CHI TIẾT

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
    setError("Đã xảy ra lỗi khi tìm kiếm sản phẩm.");
  }
}; //TÌM KIẾM SẢN PHẨM

export {
  fetchProducts,
  fetchProductTitle,
  fetchProductDetail,
  fetchSearchProduct,
};
