import { useEffect, useState } from "react";
import { deleteCartItem, fetchCartItems } from "../apis/cartitemApi";
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { toast } from "react-toastify";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleDeleteCartItem = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này không?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await deleteCartItem(id, token);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.cartitem_id !== id)
      );
      toast("Xóa sản phẩm thành công!", { type: "success" });
    } catch (error) {
      alert(error.message || "Xóa sản phẩm thất bại!");
    }
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchCartItems(
        (items) => {
          const parsedItems = items.map((item) => ({
            ...item,
            price: Number(item.price),
            shipfee: Number(item.shipfee),
            product_quantity: Number(item.product_quantity),
          }));
          setCartItems(parsedItems);
        },
        setTotalItem,
        setTotalPages,
        token,
        page
      ).finally(() => {
        setLoading(false);
      });
    }
  }, [token, page]);

  const calculateTotals = () => {
    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.price * item.product_quantity,
      0
    );
    const totalShipFee = cartItems.reduce((acc, item) => acc + item.shipfee, 0);
    const totalAll = totalPrice + totalShipFee;

    return { totalPrice, totalShipFee, totalAll };
  };

  const { totalPrice, totalShipFee, totalAll } = calculateTotals();

  const handlePageChange = (event) => {
    const selectedPage = parseInt(event.target.value, 10);
    setPage(selectedPage);
  };

  return (
    <main className="py-24 container font-manrope">
      <div className="flex gap-14">
        <div className="w-3/5">
          <h1 className="text-xl font-bold">Giỏ hàng của bạn</h1>
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : (
            cartItems.map((cart) => (
              <div
                key={cart.cartitem_id}
                className="flex gap-5 mt-5 py-4 border-t"
              >
                <div className="w-24 h-24">
                  <img
                    className="w-full h-full object-cover"
                    src={`http://localhost:3000/${cart.product_images[0]}`}
                    alt=""
                  />
                </div>
                <p className="flex flex-col border-l pl-2">
                  <span className="text-lg font-semibold first-letter:uppercase">
                    {cart.title}
                  </span>
                  <span className="text-[#566363]">
                    {cart.price.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="font-semibold mt-2">
                    Số lượng: {cart.product_quantity}
                  </span>
                </p>
                <div className="ml-auto text-right text-[#566363]">
                  <p>{cart.category_name}</p>
                  <p>{cart.shipfee.toLocaleString("vi-VN")}đ</p>
                  <button
                    onClick={() => handleDeleteCartItem(cart.cartitem_id)}
                    className="hover:border-b-2 hover:border-[#131717] hover:text-[#131717] mt-4"
                  >
                    Xóa sản phẩm
                  </button>
                </div>
              </div>
            ))
          )}
          {totalItem > 5 && (
            <div className="flex justify-center items-center gap-1 mt-8">
              <button
                className="px-1 py-1 mx-2 bg-[#005d6312] rounded hover:bg-[#005c6338] border border-primaryColor hover:border"
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page === 1}
              >
                <MdKeyboardDoubleArrowLeft />
              </button>
              <select
                className="border-2 px-1"
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
                className="px-1 py-1 mx-2 bg-[#005d6312] rounded hover:bg-[#005c6338] border border-primaryColor hover:border"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === totalPages}
              >
                <MdKeyboardDoubleArrowRight />
              </button>
            </div>
          )}
        </div>
        <div className="w-2/5">
          <h3 className="text-xl font-bold">Giá sản phẩm</h3>
          <ul className="border-y my-4 flex flex-col gap-3 text-[#566363]">
            <li className="flex items-center justify-between">
              <span>Giá gốc</span>
              <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Phí ship</span>
              <span>{totalShipFee.toLocaleString("vi-VN")}đ</span>
            </li>
          </ul>
          <p className="flex items-center justify-between">
            <span>Tổng giá</span>
            <span>{totalAll.toLocaleString("vi-VN")}đ</span>
          </p>
          <button className="w-full mt-6 py-2 bg-primaryColor text-white">
            Thanh toán
          </button>
        </div>
      </div>
    </main>
  );
}

export default Cart;
