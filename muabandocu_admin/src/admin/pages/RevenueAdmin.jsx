import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../components/Loading";

function RevenueAdmin() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [orderWithMomo, setOrdersWithMomo] = useState([]);
  const [revenueItemCod, setRevenueItemCod] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  // Tổng doanh thu với tất cả đơn hàng
  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/revenue/statisticalAdmin",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { month: selectedMonth, year: selectedYear },
        }
      );
      setRevenueData(response.data || []);
    } catch (err) {
      setError("Không thể tải dữ liệu doanh thu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [selectedMonth, selectedYear]);

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

  // danh sách người đã trả thanh toán cod
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/revenue/order-items-cod",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRevenueItemCod(response.data.data);
      } catch (err) {
        setError("Không thể tải dữ liệu doanh thu.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);
  console.log(revenueItemCod);

  const handlePayment = async (orderItemId, amount, momoAccount) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/revenue/momo-payment-seller",
        {
          orderItemId,
          totalprice: amount,
          payment_method: "momo",
          momoAccount: momoAccount,
          redirectUrl: window.location.origin + "/admin",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        alert("Không thể tạo giao dịch MoMo.");
      }
    } catch (error) {
      console.error("Lỗi thanh toán MoMo:", error);
      alert("Đã xảy ra lỗi khi xử lý thanh toán.");
    }
  };

  const calculateTotal = (data, field) => {
    if (!data || data.length === 0) return 0;
    return data.reduce((total, item) => {
      const amount = parseFloat(item[field]);
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  };
  const calculateTotalRevenue = (percent) => {
    const total = revenueData.reduce(
      (total, item) => total + parseInt(item.totalRevenue),
      0
    );
    return total ? total * percent : 0;
  };

  // lọc trạng thái người thanh toán trong phần cod
  const filteredData = revenueItemCod.filter((item) => {
    if (filterStatus === "paid") return item.pay_admin === 1;
    if (filterStatus === "unpaid") return item.pay_admin === 0;
    return true; // 'all'
  });
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>{error}</div>;
  console.log(revenueData);

  return (
    <section className="p-5">
      <div className="p-2 pb-8 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold mb-3">Doanh thu</h1>
        <div className="flex items-center gap-4 mb-7">
          <div>
            <label
              htmlFor="month"
              className="block text-sm font-medium text-gray-700"
            >
              Tháng:
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="mt-1 block  border w-32 h-10 border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Tất cả</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700"
            >
              Năm:
            </label>
            <input
              type="number"
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="mt-1 block h-10 w-40 border border-gray-300 rounded-md shadow-sm"
              placeholder="VD: 2023"
            />
          </div>
          <button
            onClick={fetchRevenueData}
            className="mt-6 bg-primaryColor px-11 text-lg py-2 text-white rounded-md"
          >
            Lọc
          </button>
        </div>
        {revenueData.length > 0 ? (
          <div>
            <div className="flex items-center gap-5">
              <h3 className="text-xl mb-3 font-semibold">
                Tổng doanh thu với 5% hoa hồng:{" "}
              </h3>
              <span className="w-48 h-16 text-2xl font-semibold rounded-xl bg-primaryColor text-white flex-center">
                {calculateTotalRevenue(0.05).toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        ) : (
          <div>Không có dữ liệu doanh thu.</div>
        )}
      </div>
      <div className="mt-5 p-2 pb-8 border-b-2 border-gray-800">
        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Doanh thu với những người thanh toán momo
          </h2>
          <div className="flex items-center gap-5 mb-5">
            <h3 className="text-lg mb-3 ">Tổng giá trị thanh toán MoMo: </h3>
            <span className="w-32 h-12 text-base font-semibold rounded-xl bg-primaryColor text-white flex-center">
              {calculateTotal(orderWithMomo, "total_price").toLocaleString() ||
                0}{" "}
              VND
            </span>
          </div>

          {orderWithMomo.length > 0 ? (
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">STT</th>
                  <th className="border border-gray-300 p-2">Tên sản phẩm</th>
                  <th className="border border-gray-300 p-2">Hình ảnh</th>
                  <th className="border border-gray-300 p-2">Người bán</th>
                  <th className="border border-gray-300 p-2">
                    Số tài khoản người dùng
                  </th>
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
                    <td className="border border-gray-300 p-2 text-center">
                      {item.user_name}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {item.momo_account}
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
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        className="py-2 px-4 text-white bg-primaryColor"
                        onClick={() =>
                          handlePayment(
                            item.order_item_id,
                            parseFloat(
                              (Number(item.product_price) +
                                Number(item.shipping_fee)) *
                                0.95
                            ),
                            item.momo_account
                          )
                        }
                      >
                        Thanh toán
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>Không có dữ liệu thanh toán MoMo.</div>
          )}
        </div>
      </div>
      <div className="mt-5">
        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Danh sách người đã trả thanh toán cod
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
                  <th className="border border-gray-300 p-2">Id sản phẩm</th>
                  <th className="border border-gray-300 p-2">Tên sản phẩm</th>
                  <th className="border border-gray-300 p-2">Người trả</th>
                  <th className="border border-gray-300 p-2">Avatar</th>
                  <th className="border border-gray-300 p-2">Số tiền đã trả</th>
                  <th className="border border-gray-300 p-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.order_item_id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.product_id}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {item.product_name}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {item.seller_name}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <img
                        src={`http://localhost:3000/${item.seller_avatar}`}
                        alt={item.seller_name}
                        className="w-16 h-16 object-cover mx-auto"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {parseFloat(
                        (Number(item.product_price) +
                          Number(item.shipping_fee)) *
                          0.05
                      ).toLocaleString()}{" "}
                      VND
                    </td>
                    <td className="border border-gray-300 p-2 text-center ">
                      {item.pay_admin === 1 ? (
                        <span className="text-[#29C55E]">Đã thanh toán</span>
                      ) : (
                        <span className="text-red-400">Chưa thanh toán</span>
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
    </section>
  );
}

export default RevenueAdmin;
