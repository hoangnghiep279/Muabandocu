import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAddresses, addAddress, updateAddress } from "../apis/addressApi";
import { ValidationAddress } from "../utils/Validation";
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
    name: "",
    phone: "",
    address: "",
    district: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [districts, setDistricts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [editingAddress, setEditingAddress] = useState(null); //luu dia chi khi sua
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const vietnamData = {
    "Hà Nội": ["Ba Đình", "Hoàn Kiếm", "Tây Hồ", "Cầu Giấy", "Đống Đa"],
    "TP Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5", "Bình Thạnh", "Tân Bình"],
    "Đà Nẵng": ["Hải Châu", "Sơn Trà", "Liên Chiểu", "Ngũ Hành Sơn"],
  };

  useEffect(() => {
    getAddresses(setAddresses, token);
  }, [token]);

  // sửa địa chi
  const handleEditAddress = (address) => {
    setEditingAddress(address); // Hiển thị form sửa
  };

  const handleUpdateAddressSubmit = async () => {
    const validationErrors = ValidationAddress(editingAddress, [
      "name",
      "phone",
      "address",
      "district",
      "city",
    ]);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await updateAddress(
        editingAddress.id,
        editingAddress,
        (updatedAddress) => {
          setAddresses((prevAddresses) =>
            prevAddresses.map((addr) =>
              addr.id === updatedAddress.id ? updatedAddress : addr
            )
          );
          setEditingAddress(null); // Đóng form sửa
        },
        token
      );
      getAddresses(setAddresses, token);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  // chon dia chi
  const handleCityChange = (city) => {
    setNewAddress({ ...newAddress, city, district: "" });
    setDistricts(vietnamData[city] || []);
  };

  const handleNewAddressSubmit = async () => {
    const validationErrors = ValidationAddress(newAddress, [
      "name",
      "phone",
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
            name: "",
            phone: "",
            address: "",
            district: "",
            city: "",
          });
          setErrors({});
        },
        token
      );
      window.location.reload();
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

    const orderData = {
      address_id: selectedAddress,
      payment_method: paymentMethod,
      shipfee: totalShipFee,
      totalprice: totalAll,
      products: cartItems.map(({ product_id, price, user_id }) => ({
        product_id,
        quantity: 1,
        price,
        seller_id: user_id,
      })),
      momoAccount: paymentMethod === "momo" ? "0559851334" : null,
      redirectUrl:
        paymentMethod === "momo"
          ? window.location.origin + "/account/prepareOrder"
          : null,
    };

    try {
      const orderResponse = await axios.post(
        "http://localhost:3000/order",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (paymentMethod === "momo" && orderResponse.data.paymentUrl) {
        window.location.href = orderResponse.data.paymentUrl;
      } else {
        alert("Đặt hàng thành công!");
        navigate("/account/pendingOrder");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };
  return (
    <div className="py-8 container font-manrope">
      <h1 className="text-xl font-bold mb-4">Thanh toán</h1>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-bold mb-2">Sản phẩm</h2>
          {cartItems.map((item) => (
            <div
              key={item.product_id}
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

        <div>
          <h2 className="text-lg font-bold mb-2">Địa chỉ giao hàng</h2>
          {addresses.length > 0 ? (
            <div>
              {addresses.map((address) => (
                <div key={address.id} className="mb-2">
                  {editingAddress?.id === address.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateAddressSubmit();
                      }}
                      className="flex flex-col gap-2"
                    >
                      <input
                        type="text"
                        value={editingAddress.name}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            name: e.target.value,
                          })
                        }
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                      )}
                      <input
                        type="text"
                        value={editingAddress.phone}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            phone: e.target.value,
                          })
                        }
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                      )}
                      <input
                        type="text"
                        value={editingAddress.address}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            address: e.target.value,
                          })
                        }
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm">{errors.address}</p>
                      )}

                      <select
                        value={editingAddress.city}
                        onChange={(e) => {
                          setEditingAddress({
                            ...editingAddress,
                            city: e.target.value,
                          });
                          setDistricts(vietnamData[e.target.value] || []);
                        }}
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
                        value={editingAddress.district}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            district: e.target.value,
                          })
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
                        <p className="text-red-500 text-sm">
                          {errors.district}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="bg-primaryColor text-white py-2"
                      >
                        Lưu
                      </button>
                      <button
                        type="button"
                        className="bg-gray-500 text-white py-2 mt-2"
                        onClick={() => setEditingAddress(null)}
                      >
                        Hủy
                      </button>
                    </form>
                  ) : (
                    <>
                      <label>
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddress === address.id}
                          onChange={() => setSelectedAddress(address.id)}
                        />
                        {`${address.address}, ${address.district}, ${address.city} (${address.name} - ${address.phone})`}
                      </label>
                      <button
                        className="ml-4 py-1 px-4 bg-primaryColor text-white rounded-lg"
                        onClick={() => handleEditAddress(address)}
                      >
                        Sửa
                      </button>
                    </>
                  )}
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
                placeholder="Tên của bạn"
                value={newAddress.name}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, name: e.target.value })
                }
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
              <input
                type="text"
                placeholder="Số điện thoại của bạn"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
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
        className="bg-primaryColor text-white py-2 px-4 mt-6"
        onClick={handlePlaceOrder}
      >
        Đặt hàng
      </button>
    </div>
  );
}

export default Checkout;
