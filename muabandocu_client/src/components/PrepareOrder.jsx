import React, { useState, useEffect } from "react";
import axios from "axios";
import { orderimg } from "../imgs";

function PrepareOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/order/1", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.data.length > 0) {
          setOrders(response.data.data);
        } else {
          setError("Không có đơn hàng nào trong trạng thái này.");
        }
        setLoading(false);
      } catch (err) {
        setError("Có lỗi xảy ra khi lấy dữ liệu.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      {orders.map((order) => (
        <div key={order.order_id}>
          {order.products.length === 0 ? (
            <div className="flex-center flex-col gap-4 h-full">
              <img src={orderimg} alt="No products" />
              <p>Không có sản phẩm nào trong đơn hàng này.</p>
            </div>
          ) : (
            <div>
              {order.products.map((product, index) => (
                <div
                  key={index}
                  className="my-4 border-y flex justify-between items-center py-2"
                >
                  <p className="flex gap-2">
                    <img
                      src={`http://localhost:3000/${product.images[0]}`}
                      alt={product.product_name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <strong>{product.product_name}</strong>
                  </p>
                  <p className="text-right">
                    <span className="block">
                      Giá sản phẩm: {product.product_price} VND
                    </span>
                    <span className="block">
                      Ship: {product.product_shipfee} VND
                    </span>
                  </p>
                </div>
              ))}
              <p className="text-right font-semibold text-lg">
                Phí ship: {order.shipfee} VND
              </p>
              <p className="text-right font-semibold text-lg">
                Tổng tiền: {order.totalprice} VND
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PrepareOrder;
