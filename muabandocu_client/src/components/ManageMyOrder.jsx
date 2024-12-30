import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ManageMyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/order/pending-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]); // Xử lý lỗi và gán mảng rỗng
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleConfirmOrder = async (orderItemId) => {
    setLoadingOrders((prev) => ({ ...prev, [orderItemId]: true }));

    try {
      const response = await axios.post(
        "http://localhost:3000/order/approve",
        {
          orderItemId, // Truyền đúng id của đơn hàng
          newStatus: 2,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Đơn hàng đã được xác nhận thành công!");
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderItemId)
        );
        navigate("/account/productOrder");
      } else {
        alert("Không thể xác nhận đơn hàng. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi xác nhận đơn hàng:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
    } finally {
      setLoadingOrders((prev) => ({ ...prev, [orderItemId]: false }));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Quản lý Đơn Hàng</h1>

      {orders.length === 0 ? (
        <p className="text-lg text-center">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md"
            >
              <img
                src={`http://localhost:3000/${order.product_image}`}
                alt={order.product_name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{order.product_name}</h2>
                <p className="text-sm text-gray-600">
                  Giá: {order.product_price} VNĐ
                </p>
                <p className="text-sm text-gray-600">
                  Phí vận chuyển: {order.shipping_fee} VNĐ
                </p>
                <p>Thông tin người mua:</p>
                <p className="text-sm text-gray-600">
                  {order.customer_name}, {order.customer_phone},{" "}
                  {order.customer_address}, {order.customer_district},{" "}
                  {order.customer_city},
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600">
                  <span> Phương thức thanh toán: </span>
                  <span className="block font-semibold text-primaryColor">
                    {order.payment_method === "cod"
                      ? "Thanh toán khi nhận hàng"
                      : "Thanh toán online"}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Ngày đặt hàng:{" "}
                  {new Date(order.created_at).toLocaleDateString("vi-VN")}
                </p>
                <button
                  onClick={() => handleConfirmOrder(order.order_item_id)}
                  disabled={loadingOrders[order.order_item_id]}
                  className={`px-4 py-2 rounded-lg ${
                    loadingOrders[order.id]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {loadingOrders[order.id]
                    ? "Đang xử lý..."
                    : "Xác nhận đơn hàng"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageMyOrder;
