import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";
import { IoAddOutline } from "react-icons/io5";
import { FiMinus } from "react-icons/fi";
import { BsCartPlus } from "react-icons/bs";
const ProductDetail = () => {
  const { id } = useParams(); // Lấy id sản phẩm từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImg, setMainImg] = useState("");
  const [description, setDescription] = useState("");
  const [isSeeMore, setIsSeeMore] = useState(false);

  const MAX_LINES = 10;

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/products/${id}`
        );

        setProduct(response.data.data);
        setMainImg("http://localhost:3000/" + response.data.data.images[0]);
        setDescription(
          response.data.data.description
            .split("\n")
            .slice(0, MAX_LINES)
            .join("\n")
        );
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  const increaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    } else {
      alert("Số lượng trong kho tối đa là: " + product.quantity);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  return (
    <main className="container py-11 font-manrope">
      <Breadcrumbs />
      <div className="flex box-shadow rounded-xl my-8 p-10 ">
        <div className="w-[45%]">
          <div className="w-full h-[450px]">
            <img
              src={mainImg}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex mt-4 gap-2">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:3000/${img}`}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 h-16 object-cover rounded-lg border cursor-pointer ${
                  mainImg === `http://localhost:3000/${img}`
                    ? "border-primaryColor"
                    : "border-gray-300"
                }`}
                onClick={() => setMainImg(`http://localhost:3000/${img}`)}
              />
            ))}
          </div>
        </div>
        <div className="ml-20 flex flex-col gap-7 w-[55%]">
          <h2 className="text-3xl font-bold text-primaryColor">
            {product.title}
          </h2>

          <p className="text-2xl font-semibold text-primaryColor">
            <span className="align-super">đ </span>
            {product.price}
          </p>
          <div className="text-lg flex items-center gap-3 ">
            <span className="text-light  opacity-70 text-black">Số lượng:</span>{" "}
            <p className="flex items-center">
              <span
                className="border p-1 flex-center cursor-pointer"
                onClick={decreaseQuantity}
              >
                <FiMinus />
              </span>{" "}
              <span className="border-t border-b px-3">{quantity}</span>
              <span
                className="border p-1 flex-center cursor-pointer"
                onClick={increaseQuantity}
              >
                <IoAddOutline />
              </span>
            </p>
          </div>
          <p className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full block">
              <img
                className="w-full h-full object-cover"
                src={`http://localhost:3000/${product.seller_avatar}`}
                alt=""
              />
            </span>
            <span className="text-light  opacity-70 text-black">
              Người bán: {product.seller_name}
            </span>{" "}
          </p>
          <p className="text-light opacity-70 text-black whitespace-pre-line">
            Mô tả: {isSeeMore ? product.description : description}{" "}
            {product.description.split("\n").length > MAX_LINES && (
              <button
                className="text-primaryColor font-medium mt-2"
                onClick={() => setIsSeeMore(!isSeeMore)}
              >
                {isSeeMore ? "Ẩn bớt" : "Xem thêm"}
              </button>
            )}
          </p>

          <div className="flex items-center gap-4">
            <button className="border bg-[#005d6312] border-primaryColor py-2 px-5 text-primaryColor flex items-center gap-2 text-lg hover:opacity-90">
              <BsCartPlus />
              Thêm giỏ hàng
            </button>
            <button className="bg-primaryColor py-2 w-44 text-white text-lg hover:opacity-90 ">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
