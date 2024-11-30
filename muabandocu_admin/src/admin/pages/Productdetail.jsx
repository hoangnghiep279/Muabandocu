import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { fetchProductDetail } from "../api/ProductApi";
import { FaArrowLeft } from "react-icons/fa";
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchProductDetail(id, setProduct, setLoading);
  }, [id]);

  if (loading) return <Loading text={"Đang tải"} />;
  if (!product) return <Loading text={"Không tìm thấy sản phẩm"} />;

  return (
    <main className="container p-5 h-screen overflow-auto">
      <h2 className="text-2xl mb-5 font-bold">Thông tin chi tiết sản phẩm</h2>
      <div>
        <table className=" border-collapse border-stone-800 border">
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
        <Link to={"/admin"}>
          <button className="bg-[#303134] flex text-white items-center gap-2 px-4 py-2 mt-4 hover:bg-opacity-90 rounded-lg">
            <FaArrowLeft />
            Trở về
          </button>
        </Link>
      </div>
    </main>
  );
};

export default ProductDetail;
