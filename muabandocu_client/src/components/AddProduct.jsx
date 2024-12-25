import React, { useState, useEffect } from "react";
import axios from "axios";
import { ValidationProduct } from "../utils/Validation";
import { fetchAddProduct } from "../apis/ProductApi";
import { useNavigate } from "react-router-dom";
import ConnectMomo from "./ConnectMomo";

function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    price: "",
    description: "",
    linkzalo: "",
    warranty: "",
    shipfee: "",
  });
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isMomoLinked, setIsMomoLinked] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Kiểm tra trạng thái liên kết MoMo
  useEffect(() => {
    const checkMomoLink = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/products/check-momo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsMomoLinked(res.data.linked);
      } catch (err) {
        console.error("Lỗi khi kiểm tra trạng thái MoMo:", err);
      } finally {
        setLoading(false);
      }
    };
    checkMomoLink();
  }, [token]);

  // Lấy danh sách loại sản phẩm
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldsToValidate = [
      "title",
      "categoryId",
      "price",
      "description",
      "linkzalo",
      "warranty",
      "shipfee",
    ];
    const validationErrors = ValidationProduct(
      formData,
      fieldsToValidate,
      files
    );
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setMessage("Vui lòng kiểm tra lại thông tin nhập vào");
      return;
    }

    fetchAddProduct(
      formData,
      files,
      setFormData,
      setFiles,
      setMessage,
      setErrors,
      navigate
    );
  };

  if (!isMomoLinked) {
    return <ConnectMomo />;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Thêm sản phẩm mới</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Tên sản phẩm:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="border w-full p-2 rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Loại sản phẩm:</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            className="border w-full p-2 rounded"
          >
            <option value="">Chọn loại sản phẩm</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 text-sm">{errors.categoryId}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Giá:</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="border w-full p-2 rounded"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Mô tả:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="border w-full p-2 rounded"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Liên hệ:</label>
          <input
            type="text"
            name="linkzalo"
            value={formData.linkzalo}
            onChange={handleInputChange}
            className="border w-full p-2 rounded"
          />
          {errors.linkzalo && (
            <p className="text-red-500 text-sm">{errors.linkzalo}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Thời gian bảo hành:</label>
          <input
            type="text"
            name="warranty"
            value={formData.warranty}
            onChange={handleInputChange}
            className="border w-full p-2 rounded"
          />
          {errors.warranty && (
            <p className="text-red-500 text-sm">{errors.warranty}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Phí vận chuyển:</label>
          <input
            type="text"
            name="shipfee"
            value={formData.shipfee}
            onChange={handleInputChange}
            className="border w-full p-2 rounded"
          />
          {errors.shipfee && (
            <p className="text-red-500 text-sm">{errors.shipfee}</p>
          )}
        </div>
        <div>
          <p className="flex items-center justify-between">
            <label className="block font-medium">Ảnh sản phẩm:</label>{" "}
            <strong>Lưu ý: Chụp các góc của sản phẩm để được duyệt</strong>
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border w-full p-2 rounded"
          />
          {errors.files && (
            <p className="text-red-500 text-sm">{errors.files}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
