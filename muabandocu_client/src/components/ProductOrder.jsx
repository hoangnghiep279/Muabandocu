import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/order/product-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]); // Xử lý lỗi và gán mảng rỗng
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">
        Trạng thái đơn hàng của bạn
      </h1>

      {orders.length === 0 ? (
        <p className="text-lg text-center">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="flex flex-col space-y-4 bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={`http://localhost:3000/${order.product_image}`}
                  alt={order.product_name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">
                    {order.product_name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Giá: {order.product_price.toLocaleString()} VNĐ
                  </p>
                  <p className="text-sm text-gray-600">
                    Phí vận chuyển: {order.shipping_fee.toLocaleString()} VNĐ
                  </p>
                  <p>Thông tin người mua:</p>
                  <p className="text-sm text-gray-600">
                    {order.customer_name}, {order.customer_phone},{" "}
                    {order.customer_address}, {order.customer_district},{" "}
                    {order.customer_city}.
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Ngày đặt hàng:{" "}
                  {new Date(order.created_at).toLocaleDateString("vi-VN")}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    order.delivery_status === 2
                      ? "text-green-500"
                      : "text-blue-500"
                  }`}
                >
                  {order.delivery_status === 2 ? "Đang giao hàng" : "Đã bán"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductOrder;
