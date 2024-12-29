import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../components/Loading";

function RevenueAdmin() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [orderWithMomo, setOrdersWithMomo] = useState([]);

  // Tổng doanh thu với tất cả đơn hàng
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/revenue/statisticalAdmin",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRevenueData(response.data.data);
      } catch (err) {
        setError("Không thể tải dữ liệu doanh thu.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  // Thông tin đã nhận với những người thanh toán momo
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/revenue/order-momo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrdersWithMomo(response.data.data);
      } catch (err) {
        setError("Không thể tải dữ liệu doanh thu.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);
  console.log(orderWithMomo);

  const calculateTotal = (data, field) => {
    if (!data || data.length === 0) return 0;
    return data.reduce((total, item) => {
      const amount = parseFloat(item[field]);
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="p-2 pb-8 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold mb-3">Doanh thu</h1>
        {revenueData.length > 0 ? (
          <div>
            <div className="flex items-center gap-5">
              <h3 className="text-xl mb-3 font-semibold">
                Tổng doanh thu với 5% hoa hồng:{" "}
              </h3>
              <span className="w-48 h-16 text-2xl font-semibold rounded-xl bg-primaryColor text-white flex-center">
                {calculateTotal(
                  revenueData,
                  "commission_amount"
                ).toLocaleString()}{" "}
                VND
              </span>
            </div>
          </div>
        ) : (
          <div>Không có dữ liệu doanh thu.</div>
        )}
      </div>
      <div className="mt-5">
        {orderWithMomo.length > 0 ? (
          <div>
            <h2>Doanh thu với những người thanh toán momo</h2>
            <div className="flex items-center gap-5 mb-5">
              <h3 className="text-xl mb-3 font-semibold">
                Tổng giá trị thanh toán MoMo:{" "}
              </h3>
              <span className="w-48 h-16 text-2xl font-semibold rounded-xl bg-primaryColor text-white flex-center">
                {calculateTotal(orderWithMomo, "total_price").toLocaleString()}{" "}
                VND
              </span>
            </div>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">STT</th>
                  <th className="border border-gray-300 p-2">Tên sản phẩm</th>
                  <th className="border border-gray-300 p-2">Hình ảnh</th>
                  <th className="border border-gray-300 p-2">Giá sản phẩm</th>
                  <th className="border border-gray-300 p-2">Phí vận chuyển</th>
                  <th className="border border-gray-300 p-2">Tổng giá</th>
                  <th className="border border-gray-300 p-2">
                    Số tiền giữ lại
                  </th>
                  <th className="border border-gray-300 p-2">
                    Số tiền cần trả{" "}
                  </th>
                  <th className="border border-gray-300 p-2">
                    Số tiền cần thanh toán
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderWithMomo.map((item, index) => (
                  <tr key={item.order_item_id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.product_name}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <img
                        src={`http://localhost:3000/${item.product_image}`}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover mx-auto"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {parseFloat(item.product_price).toLocaleString()} VND
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {parseFloat(item.shipping_fee).toLocaleString()} VND
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {parseFloat(item.total_price).toLocaleString()} VND
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {parseFloat(item.total_price).toLocaleString()} VND
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {parseFloat(item.total_price).toLocaleString()} VND
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      <button>Thanh toán</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>Không có dữ liệu thanh toán MoMo.</div>
        )}
      </div>
    </>
  );
}

export default RevenueAdmin;
