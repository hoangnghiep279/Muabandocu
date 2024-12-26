import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { orderimg } from "../imgs";

function ShippingOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/order/2", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.data.length > 0) {
          setOrders(response.data.data);
        } else {
          setError("Không có đơn hàng nào trong trạng thái này.");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Có lỗi xảy ra khi lấy dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleConfirmOrder = async (orderItemId) => {
    setLoadingOrders((prev) => ({ ...prev, [orderItemId]: true }));

    try {
      const response = await axios.post(
        "http://localhost:3000/order/approve",
        {
          orderItemId,
          newStatus: 3,
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
          prevOrders.filter((order) => order.order_id !== orderItemId)
        );
        navigate("/account/receivedOrder");
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
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      {orders.length === 0 ? (
        <div className="flex-center flex-col gap-4 h-full">
          <h2 className="font-slab font-bold text-xl">
            Đơn hàng đang chờ xác nhận
          </h2>
          <img src={orderimg} alt="" />
          <p>Không có đơn hàng nào trong trạng thái này.</p>
        </div>
      ) : (
        <div>
          {orders.map((order) => {
            if (order.products.length === 0) {
              return (
                <div
                  key={order.order_id}
                  className="flex-center flex-col gap-4 h-full"
                >
                  <img src={orderimg} alt="" />
                  <p>Không có sản phẩm nào trong đơn hàng này.</p>
                </div>
              );
            }

            return (
              <div key={order.order_id} className="my-4 border-b pb-4">
                <div>
                  {order.products.map((product, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2"
                    >
                      <div className="flex gap-2">
                        <img
                          src={`http://localhost:3000/${product.images[0]}`}
                          alt={product.product_name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div>
                          <strong className="font-semibold text-xl">
                            {product.product_name}
                          </strong>
                          <p>Giá sản phẩm: {product.product_price} VND</p>
                          <p>Ship: {product.product_shipfee} VND</p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleConfirmOrder(product.order_item_id)
                        }
                        disabled={loadingOrders[product.order_item_id]}
                        className={`px-4 py-2 rounded-lg ${
                          loadingOrders[product.order_item_id]
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-primaryColor text-white hover:opacity-90"
                        }`}
                      >
                        {loadingOrders[product.order_item_id]
                          ? "Đang xử lý..."
                          : "Đã nhận đơn hàng"}
                      </button>
                    </div>
                  ))}
                  {order.products.length > 0 && (
                    <>
                      <p className="text-right font-semibold text-lg">
                        Phí ship: {order.shipfee} VND
                      </p>
                      <p className="text-right font-semibold text-lg">
                        Tổng tiền: {order.totalprice} VND
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ShippingOrder;
