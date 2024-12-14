import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAddresses, addAddress } from "../apis/addressApi";
import { ValidationCheckout } from "../utils/Validation";
import axios from "axios";

function Checkout() {
  const location = useLocation();
  const { cartItems, totalAll, totalShipFee } = location.state || {
    cartItems: [],
    totalAll: 0,
    totalShipFee: 0,
  };

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    address: "",
    district: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [districts, setDistricts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");

  const token = localStorage.getItem("token");

  const vietnamData = {
    "Hà Nội": ["Ba Đình", "Hoàn Kiếm", "Tây Hồ", "Cầu Giấy", "Đống Đa"],
    "TP Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5", "Bình Thạnh", "Tân Bình"],
    "Đà Nẵng": ["Hải Châu", "Sơn Trà", "Liên Chiểu", "Ngũ Hành Sơn"],
  };

  useEffect(() => {
    getAddresses(setAddresses, token);
  }, [addresses]);

  const handleCityChange = (city) => {
    setNewAddress({ ...newAddress, city, district: "" });
    setDistricts(vietnamData[city] || []);
  };

  const handleNewAddressSubmit = async () => {
    const validationErrors = ValidationCheckout(newAddress, [
      "address",
      "district",
      "city",
    ]);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await addAddress(
        newAddress,
        (newAddr) => {
          setAddresses((prevAddresses) => [...prevAddresses, newAddr]);
          setSelectedAddress(newAddr.id);
          setNewAddress({
            address: "",
            district: "",
            city: "",
          });
          setErrors({});
        },
        token
      );
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Vui lòng chọn địa chỉ trước khi đặt hàng!");
      return;
    }
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/orders",
        {
          address_id: selectedAddress,
          cart_items: cartItems.map(({ cartitem_id, product_quantity }) => ({
            cartitem_id,
            quantity: product_quantity,
          })),
          total_price: totalAll,
          payment_method: paymentMethod, // Include payment method in the order
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Đặt hàng thành công!");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="py-8 container font-manrope">
      <h1 className="text-xl font-bold mb-4">Thanh toán</h1>
      <div className="grid grid-cols-2 gap-6">
        {/* Thông tin sản phẩm */}
        <div>
          <h2 className="text-lg font-bold mb-2">Sản phẩm</h2>
          {cartItems.map((item) => (
            <div
              key={item.cartitem_id}
              className="border-b py-2 flex justify-between"
            >
              <p className="font-medium first-letter:uppercase">{item.title}</p>
              <p>{item.price.toLocaleString("vi-VN")}đ</p>
            </div>
          ))}
          <p className="mt-4 font-bold text-right">
            Phí ship: {totalShipFee.toLocaleString("vi-VN")}đ
          </p>
          <p className="mt-4 font-bold text-right">
            Tổng cộng: {totalAll.toLocaleString("vi-VN")}đ
          </p>
        </div>

        {/* Thông tin địa chỉ */}
        <div>
          <h2 className="text-lg font-bold mb-2">Địa chỉ giao hàng</h2>
          {addresses.length > 0 ? (
            <div>
              {addresses.map((address) => (
                <div key={address.id} className="mb-2">
                  <label>
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddress === address.id}
                      onChange={() => setSelectedAddress(address.id)}
                    />
                    {`${address.address}, ${address.district}, ${address.city} (${address.user_name} - ${address.user_phone})`}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleNewAddressSubmit();
              }}
            >
              <h3 className="text-md font-bold">Thêm địa chỉ mới</h3>

              <input
                type="text"
                placeholder="Địa chỉ"
                value={newAddress.address}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address: e.target.value })
                }
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
              <select
                value={newAddress.city}
                onChange={(e) => handleCityChange(e.target.value)}
              >
                <option value="">Chọn Thành phố</option>
                {Object.keys(vietnamData).map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city}</p>
              )}
              <select
                value={newAddress.district}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, district: e.target.value })
                }
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-red-500 text-sm">{errors.district}</p>
              )}
              <button
                type="submit"
                className="bg-primaryColor text-white py-2 mt-2"
              >
                Lưu địa chỉ
              </button>
            </form>
          )}
        </div>

        {/* Phương thức thanh toán */}
        <div>
          <h2 className="text-lg font-bold mb-2">Phương thức thanh toán</h2>
          <div className="mb-4">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Thanh toán khi nhận hàng (COD)
            </label>
          </div>
          <div className="mb-4">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="momo"
                checked={paymentMethod === "momo"}
                onChange={() => setPaymentMethod("momo")}
              />
              Thanh toán qua Momo
            </label>
          </div>
        </div>
      </div>
      <button
        className="bg-green-500 text-white py-2 px-4 mt-6"
        onClick={handlePlaceOrder}
      >
        Đặt hàng
      </button>
    </div>
  );
}

export default Checkout;
