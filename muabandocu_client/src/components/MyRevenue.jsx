import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoArrowForwardOutline, IoArrowBackSharp } from "react-icons/io5";
import Loading from "./Loading";

function MyRevenue() {
  const [revenueData, setRevenueData] = useState([]);
  const [productPaymentCod, setProductPaymentCod] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const BASE_URL = "http://localhost:3000/";
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Phân trang
  const handlePageChange = (event) => {
    const selectedPage = parseInt(event.target.value, 10);
    setPage(selectedPage);
  };

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}revenue`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { month: selectedMonth, year: selectedYear },
      });
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

  // Product Payment Cod
  useEffect(() => {
    const fetchProductPaymentCod = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/revenue/payment_cod?page=${page}&limit=5`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProductPaymentCod(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        setError("Không thể tải dữ liệu doanh thu.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductPaymentCod();
  }, [page]);
  console.log(productPaymentCod);

  // Tính tổng doanh thu
  const calculateTotalRevenue = (percent) => {
    const total = revenueData.reduce(
      (total, item) => total + parseInt(item.totalRevenue),
      0
    );
    return total ? total * percent : 0;
  };

  const handlePayment = async (orderItemId, amount) => {
    try {
      console.log("Token:", token);
      console.log("Payload:", {
        orderItemId,
        totalprice: amount,
        payment_method: "momo",
        momoAccount: "0559851334",
        redirectUrl: window.location.origin + "/account/myrevenue",
      });

      const response = await axios.post(
        "http://localhost:3000/revenue/momo-payment",
        {
          orderItemId,
          totalprice: amount,
          payment_method: "momo",
          momoAccount: "0559851334",
          redirectUrl: window.location.origin + "/account/myrevenue",
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

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>{error}</div>;
  console.log(revenueData);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Doanh Thu Của Bạn</h1>
      <div className="flex items-center gap-4">
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
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            placeholder="VD: 2023"
          />
        </div>
        <button
          onClick={fetchRevenueData}
          className="mt-6 px-4 py-2 bg-primaryColor text-white rounded-md"
        >
          Lọc
        </button>
      </div>
      {revenueData.length > 0 ? (
        <div className="flex gap-4 flex-col">
          <div className="flex items-center justify-between flex-wrap">
            <div>
              <h3 className="text-lg font-medium mb-2">Tổng doanh thu gốc:</h3>
              <span className="w-44 h-14 text-xl font-medium bg-primaryColor flex-center text-white block">
                {calculateTotalRevenue(1).toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div>
              <h3 className="text-base font-medium mb-2">
                Doanh thu khi trừ hoa hồng (5%):
              </h3>
              <span className="w-44 h-14 text-xl font-medium bg-primaryColor flex-center text-white block">
                {calculateTotalRevenue(0.95).toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Số lượng đã bán:</h3>
              <span className="w-44 h-14 text-xl font-medium bg-primaryColor flex-center text-white block">
                {revenueData.reduce((total, item) => item.totalQuantity, 0)}
              </span>
            </div>
          </div>
          <div className="w-full h-0.5 my-8 bg-slate-900"></div>
          <div>
            <h3 className="text-lg font-semibold">
              Danh sách sản phẩm cần thanh toán hoa hồng cho admin
            </h3>
            {productPaymentCod.length > 0 ? (
              <div className="flex justify-end mb-3 gap-1 items-center">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  <IoArrowBackSharp />
                </button>
                <select
                  className="border px-1"
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
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  <IoArrowForwardOutline />
                </button>
              </div>
            ) : (
              <p></p>
            )}
            {productPaymentCod.length > 0 ? (
              <table className="table-auto border-collapse border border-gray-400 w-full mt-4">
                <thead>
                  <tr>
                    <th className="border border-gray-400 px-4 py-2">
                      Tên sản phẩm
                    </th>
                    <th className="border border-gray-400 px-4 py-2">
                      Tên người mua
                    </th>
                    <th className="border border-gray-400 px-4 py-2">Giá</th>
                    <th className="border border-gray-400 px-4 py-2">
                      Phí vận chuyển
                    </th>
                    <th className="border border-gray-400 px-4 py-2">Ảnh</th>
                    <th className="border border-gray-400 px-4 py-2">
                      % trả admin
                    </th>
                    <th className="border border-gray-400 px-4 py-2">
                      Thanh toán admin
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productPaymentCod.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-400 px-4 py-2">
                        {item.product_name}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {item.buyer_name}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {parseInt(item.product_price).toLocaleString("vi-VN")}đ
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {item.shipping_fee}đ
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <img
                          src={`${BASE_URL}${item.product_image}`}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {(
                          (Number(item.product_price) +
                            Number(item.shipping_fee)) *
                          0.05
                        ).toLocaleString("vi-VN")}
                        đ
                      </td>
                      <td className="text-center">
                        <button
                          className="py-2 px-4 text-white bg-primaryColor"
                          onClick={() =>
                            handlePayment(
                              item.order_item_id,
                              (Number(item.product_price) +
                                Number(item.shipping_fee)) *
                                0.05
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
              <p>Không tồn tại sản phẩm nào</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xl mt-2">Bạn chưa bán sản phẩm nào.</p>
      )}
    </div>
  );
}

export default MyRevenue;
