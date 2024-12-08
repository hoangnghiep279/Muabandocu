import React, { useState, useEffect } from "react";
import {
  fetchPendingProducts,
  deleteProduct,
  updateProduct,
} from "../apis/ProductApi";
import { IoArrowForwardOutline, IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";
import { Link } from "react-router-dom";

const UserPendingProduct = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    shipfee: "",
    warranty: "",
    zaloLink: "",
    images: [],
    category_id: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/category");
        setCategories(res.data.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách loại sản phẩm:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPendingProducts(setProducts, setTotalPages, page);
  }, [page]);

  const handlePageChange = (event) => {
    const selectedPage = parseInt(event.target.value, 10);
    setPage(selectedPage);
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này không?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await deleteProduct(productId, token);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      alert("Xóa sản phẩm thành công!");
    } catch (error) {
      alert(error.message || "Xóa sản phẩm thất bại!");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      category_id: product.category_id || "",
      title: product.title,
      zaloLink: product.zaloLink || "",
      description: product.description,
      price: product.price,
      warranty: product.warranty || "",
      shipfee: product.shipfee,
      images: [],
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      const dataToSend = new FormData();
      dataToSend.append("category_id", formData.category_id || null);
      dataToSend.append("title", formData.title || "");
      dataToSend.append("zaloLink", formData.zaloLink || null);
      dataToSend.append("description", formData.description || "");
      dataToSend.append("price", formData.price || "");
      dataToSend.append("warranty", formData.warranty || null);
      dataToSend.append("shipfee", formData.shipfee || "");

      formData.images.forEach((image) => {
        dataToSend.append("images", image);
      });

      await updateProduct(selectedProduct.id, dataToSend, token);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, ...formData }
            : product
        )
      );
      alert("Cập nhật sản phẩm thành công!");
      setSelectedProduct(null);
      window.location.reload();
    } catch (error) {
      alert("Cập nhật sản phẩm thất bại!");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl text-center mb-4">Danh sách sản phẩm chờ duyệt</h2>
      {products.length > 0 && (
        <div className="flex justify-end mb-3 gap-1 items-center">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <IoArrowBackSharp />
          </button>
          <select
            className="border px-1"
            value={page}
            onChange={handlePageChange}
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            <IoArrowForwardOutline />
          </button>
        </div>
      )}
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id} className="w-full h-28 border flex">
              <div className="w-28 h-28 p-2">
                <Link to={`/product/${product.product_id || product.id}`}>
                  <img
                    className="w-full h-full object-cover"
                    src={`http://localhost:3000/${product.images[0]}`}
                    alt="Product"
                  />
                </Link>
              </div>
              <div className="border-l ml-4 p-2 flex-grow h-full flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <div>
                    <Link to={`/product/${product.product_id || product.id}`}>
                      <h3 className="font-semibold tracking-wider text-lg">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="opacity-80 mt-2">{product.price} đ</p>
                  </div>
                  <p className="self-start">
                    Phí ship:{" "}
                    <span className="opacity-80">{product.shipfee} đ</span>
                  </p>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <p>Loại sản phẩm: {product.category_name}</p>
                  <div className="flex items-center text-purple-700 gap-1">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="pr-2 border-r-2 border-purple-800"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="pl-2 border-l-2 border-purple-800"
                    >
                      Xóa sản phẩm
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có sản phẩm nào</p>
      )}

      {selectedProduct && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-1/2 ">
            <h3 className="text-xl mb-4">Chỉnh sửa sản phẩm</h3>
            <div className="flex gap-10">
              <div className="w-1/2">
                <div>
                  <label htmlFor="title">Tiêu đề:</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="border w-full p-2 mb-4"
                  />
                </div>
                <div>
                  <label htmlFor="category">Loại sản phẩm:</label>
                  <select
                    id="category"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleFormChange}
                    className="border w-full p-2 mb-4"
                  >
                    <option value="">Chọn loại sản phẩm</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="price">Giá:</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    className="border w-full p-2 mb-4"
                  />
                </div>
                <div>
                  <label htmlFor="description">Mô tả:</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="border w-full p-2 mb-4"
                  ></textarea>
                </div>
              </div>
              <div className="w-1/2">
                <div>
                  <label htmlFor="shipfee">Phí vận chuyển:</label>
                  <input
                    type="text"
                    id="shipfee"
                    name="shipfee"
                    value={formData.shipfee}
                    onChange={handleFormChange}
                    className="border w-full p-2 mb-4"
                  />
                </div>
                <div>
                  <label htmlFor="warranty">Bảo hành:</label>
                  <input
                    type="text"
                    id="warranty"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleFormChange}
                    className="border w-full p-2 mb-4"
                  />
                </div>
                <div>
                  <label htmlFor="zaloLink">Link Zalo:</label>
                  <input
                    type="text"
                    id="zaloLink"
                    name="zaloLink"
                    value={formData.zaloLink}
                    onChange={handleFormChange}
                    className="border w-full p-2 mb-4"
                  />
                </div>
                <div>
                  <label htmlFor="images">Ảnh sản phẩm:</label>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    onChange={handleFileChange}
                    className="border w-full p-2 mb-4"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-gray-500 text-white p-2 px-5 rounded-md"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateProduct}
                className="bg-blue-500 text-white p-2 px-5 rounded-md"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPendingProduct;
