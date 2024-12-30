import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./Loading";

function MyRevenueMomo() {
  const [revenueItemMomo, setRevenueItemMomo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [filterStatus, setFilterStatus] = useState("all");
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/revenue/order-items-momo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRevenueItemMomo(response.data.data);
      } catch (err) {
        setError("Không thể tải dữ liệu doanh thu.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);
  console.log(revenueItemMomo);
  const filteredData = revenueItemMomo.filter((item) => {
    if (filterStatus === "paid") return item.pay_seller === 1;
    if (filterStatus === "unpaid") return item.pay_seller === 0;
    return true; // 'all'
  });

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>{error}</div>;
  return (
    <div>
      <div className="mt-5">
        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Danh sách sản phẩm được thanh toán qua Momo
          </h2>

          <div className="mb-4 text-right">
            <h2 className="font-medium">Lọc trạng thái:</h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="all">Tất cả</option>
              <option value="paid">Đã thanh toán</option>
              <option value="unpaid">Chưa thanh toán</option>
            </select>
          </div>
          {filteredData.length > 0 ? (
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">STT</th>
                  <th className="border border-gray-300 p-2">Tên sản phẩm</th>
                  <th className="border border-gray-300 p-2">Tổng tiền</th>
                  <th className="border border-gray-300 p-2">
                    Số tiền nhận lại
                  </th>
                  <th className="border border-gray-300 p-2">
                    Số tiền phải trích 5%
                  </th>
                  <th className="border border-gray-300 p-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.order_item_id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2 text-center">
                      {index + 1}
                    </td>

                    <td className="border border-gray-300 p-2 text-center">
                      {item.product_name}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {parseFloat(
                        Number(item.product_price) + Number(item.shipping_fee)
                      ).toLocaleString()}{" "}
                      VND
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {parseFloat(
                        (Number(item.product_price) +
                          Number(item.shipping_fee)) *
                          0.05
                      ).toLocaleString()}{" "}
                      VND
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {parseFloat(
                        (Number(item.product_price) +
                          Number(item.shipping_fee)) *
                          0.95
                      ).toLocaleString()}{" "}
                      VND
                    </td>
                    <td className="border border-gray-300 p-2 text-center ">
                      {item.pay_seller === 1 ? (
                        <span className="text-[#29C55E]">Đã nhận</span>
                      ) : (
                        <span className="text-red-400">Chưa nhận</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>Không có dữ liệu phù hợp.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyRevenueMomo;
