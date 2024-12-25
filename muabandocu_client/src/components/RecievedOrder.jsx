import React, { useState, useEffect } from "react";
import axios from "axios";
import { orderimg } from "../imgs";

function RecievedOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/order/3", {
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
    <div className="">
      {orders.length === 0 ? (
        <div className="flex-center flex-col gap-4 h-full ">
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
                  className="flex-center flex-col gap-4 h-full "
                >
                  <img src={orderimg} alt="" />
                  <p>Không có sản phẩm nào trong đơn hàng này.</p>
                </div>
              );
            }

            return (
              <div key={order.order_id}>
                <div>
                  {order.products.map((product, index) => (
                    <div
                      key={index}
                      className="my-4 border-y flex justify-between items-center py-2"
                    >
                      <p className="flex gap-4">
                        <img
                          src={`http://localhost:3000/${product.images[0]}`}
                          alt={product.product_name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <strong className="text-xl mt-3">
                          {product.product_name}
                        </strong>
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

export default RecievedOrder;
