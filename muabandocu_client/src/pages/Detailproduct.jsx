import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { BsCartPlus } from "react-icons/bs";
import Loading from "../components/Loading";
import { fetchProductDetail } from "../apis/ProductApi";
import { addCartItem } from "../apis/cartitemApi";
const ProductDetail = () => {
  const { id } = useParams(); // Lấy id sản phẩm từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImg, setMainImg] = useState("");
  const [description, setDescription] = useState("");
  const [isSeeMore, setIsSeeMore] = useState(false);
  const navigate = useNavigate();

  console.log(product);

  const handleBuyNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để mua sản phẩm.");
      navigate("/login");
      return;
    }

    // Giả sử `token` chứa thông tin người dùng sau khi được giải mã
    const user = JSON.parse(atob(token.split(".")[1])); // Decode payload từ JWT token
    if (user.id === product.user_id) {
      alert("Bạn không thể mua sản phẩm do chính bạn đăng.");
      return;
    }

    const productData = {
      cartItems: [
        {
          product_id: product.product_id,
          title: product.title,
          price: product.price,
          quantity: quantity,
          user_id: product.user_id,
        },
      ],
      totalAll: product.price * quantity,
      totalShipFee: 30000, // Bạn có thể thay phí ship bằng giá trị thực
    };

    navigate("/checkout", { state: productData });
  };
  const MAX_LINES = 7;
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchProductDetail(
      setProduct,
      setMainImg,
      setDescription,
      MAX_LINES,
      setLoading,
      id
    );
  }, [id]);
  console.log(product);
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      navigate("/login"); // Chuyển hướng đến trang đăng nhập
      return;
    }

    const result = await addCartItem(product);
  };

  if (loading) return <Loading />;
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
              <span className="border-t border-b px-3">{quantity}</span>
            </p>
          </div>
          <p className="text-lg font-medium italic">
            <span className="block">Phí ship: {product.shipfee}</span>
            <span className="block">Bảo hành: {product.warranty}</span>
          </p>

          <Link
            to={{
              pathname: token === product.user_id ? "/account" : "/shopuser",
              search: `?userId=${product.user_id}`,
            }}
          >
            <p className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full block">
                <img
                  className="w-full h-full object-cover"
                  src={`http://localhost:3000/${product.seller_avatar}`}
                  alt=""
                />
              </span>
              <span className="text-light font-semibold opacity-70 text-black">
                Người bán: {product.seller_name}
              </span>
            </p>
          </Link>

          <p className="text-light opacity-70 text-black whitespace-pre-line">
            Mô tả:{" "}
            {isSeeMore
              ? product.description || "Không có mô tả"
              : description || "Không có mô tả"}{" "}
            {product.description &&
              product.description.split("\n").length > MAX_LINES && (
                <button
                  className="text-primaryColor font-medium mt-2"
                  onClick={() => setIsSeeMore(!isSeeMore)}
                >
                  {isSeeMore ? "Ẩn bớt" : "Xem thêm"}
                </button>
              )}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddToCart}
              className="border bg-[#005d6312] border-primaryColor py-2 px-5 text-primaryColor flex items-center gap-2 text-lg hover:opacity-90"
            >
              <BsCartPlus />
              Thêm giỏ hàng
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-primaryColor py-2 w-44 text-white text-lg hover:opacity-90"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
