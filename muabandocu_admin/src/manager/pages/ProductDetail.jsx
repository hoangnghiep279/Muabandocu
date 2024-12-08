import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { IoArrowBackSharp } from "react-icons/io5";
import {
  fetchProductDetail,
  approveProduct,
  handleRejectProduct,
} from "../api/ProductApi";
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchProductDetail(setProduct, setLoading, id);
  }, [id]);

  const handleApprove = (productId) => {
    approveProduct(productId, setProduct);
  };

  const handleReject = (productId) => {
    handleRejectProduct(productId, setProduct);
    navigate("/manager");
    window.location.reload();
  };

  if (loading) return <Loading text={"Đang tải"} />;
  if (!product) return <Loading text={"Không tìm thấy sản phẩm"} />;

  return (
    <main className="container p-5 h-screen overflow-auto">
      <div>
        <Link to={"/manager"}>
          <button className="bg-[#303134] text-white text-2xl hover:bg-gray-600 py-2 px-4 rounded">
            <IoArrowBackSharp />
          </button>
        </Link>
        <h2 className="text-2xl mb-5 font-bold text-center">
          Thông tin chi tiết sản phẩm
        </h2>
      </div>
      <div>
        <table className="border-collapse w-full border-stone-800 border">
          <tbody>
            <tr className="h-12 max-h-16">
              <td className="w-1/6 border-stone-800 border font-semibold">
                Người đăng sản phẩm:
              </td>
              <td className="border-stone-800 border px-3">
                {product.seller_name}
              </td>
            </tr>
            <tr className="h-12 max-h-16">
              <td className="w-1/6 border-stone-800 border font-semibold">
                Loại sản phẩm:
              </td>
              <td className="border-stone-800 border px-3">
                {product.category_name}
              </td>
            </tr>
            <tr className="h-12 max-h-16">
              <td className="w-1/6 border-stone-800 border font-semibold">
                Tên sản phẩm:
              </td>
              <td className="border-stone-800 border px-3">{product.title}</td>
            </tr>
            <tr className="h-12 max-h-16">
              <td className="w-1/6 border-stone-800 border font-semibold">
                Linkzalo:
              </td>
              <td className="border-stone-800 border px-3">
                {product.linkzalo}
              </td>
            </tr>
            <tr className="h-12 max-h-16">
              <td className="w-1/6 border-stone-800 border font-semibold">
                Giá:
              </td>
              <td className="border-stone-800 border px-3">{product.price}</td>
            </tr>
            <tr className="h-12 max-h-16">
              <td className="w-1/6 border-stone-800 border font-semibold">
                Bảo hành:
              </td>
              <td className="border-stone-800 border px-3">
                {product.warranty}
              </td>
            </tr>
            <tr className="h-12 max-h-16">
              <td className="w-1/6 border-stone-800 border font-semibold">
                Phí ship:
              </td>
              <td className="border-stone-800 border px-3">
                {product.shipfee}
              </td>
            </tr>
            <tr className="h-28 max-h-36">
              <td className="w-1/6 border-stone-800 border font-semibold">
                Mô tả sản phẩm:
              </td>
              <td className="border-stone-800 border pl-3">
                <div className="whitespace-pre-line h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 px-2 py-1">
                  {product.description || "Chưa có mô tả sản phẩm."}
                </div>
              </td>
            </tr>
            <tr className="max-h-36">
              <td className="w-1/6 border-stone-800 border font-semibold">
                Ảnh sản phẩm:
              </td>
              <td className="flex gap-2 px-3">
                {" "}
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:3000/${img}`}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-28 h-28 object-cover rounded-lg border cursor-pointer`}
                  />
                ))}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end w-full mt-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleApprove(id)}
          >
            Duyệt
          </button>
          <button
            onClick={() => handleReject(id)}
            className="bg-red-500 ml-2 hover:bg-red-700 whitespace-nowrap text-white py-2 px-4 rounded"
          >
            Từ chối
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
