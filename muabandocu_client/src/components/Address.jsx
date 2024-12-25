import React, { useEffect, useState } from "react";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../apis/addressApi";
import { CiSquarePlus } from "react-icons/ci";
import { ValidationAddress } from "../utils/Validation";

const vietnamData = {
  "Hà Nội": ["Ba Đình", "Hoàn Kiếm", "Tây Hồ", "Cầu Giấy", "Đống Đa"],
  "TP Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5", "Bình Thạnh", "Tân Bình"],
  "Đà Nẵng": ["Hải Châu", "Sơn Trà", "Liên Chiểu", "Ngũ Hành Sơn"],
};

function Address() {
  const [addressList, setAddressList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formAddress, setFormAddress] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    getAddresses(setAddressList, token);
  }, []);

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setFormAddress((prev) => ({ ...prev, city: selectedCity, district: "" }));
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormAddress((prev) => ({ ...prev, district: selectedDistrict }));
  };

  const districts = vietnamData[formAddress.city] || [];
  // them dia chi
  const handleAddAddress = async () => {
    const validationErrors = ValidationAddress(formAddress, [
      "name",
      "phone",
      "address",
      "district",
      "city",
    ]);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await addAddress(
        formAddress,
        (newItem) => {
          setAddressList((prev) => [...prev, newItem]);
          setShowForm(false);
        },
        token
      );
      getAddresses(setAddressList, token);
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
    }
  };
  // update
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setFormAddress({
      name: address.name,
      phone: address.phone,
      address: address.address,
      district: address.district,
      city: address.city,
    });
    setShowForm(true);
  };

  const handleUpdateAddress = async () => {
    const validationErrors = ValidationAddress(formAddress, [
      "name",
      "phone",
      "address",
      "district",
      "city",
    ]);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await updateAddress(
        editingAddress.id,
        formAddress,
        (updatedAddress) => {
          setAddressList((prev) =>
            prev.map((item) =>
              item.id === updatedAddress.id
                ? { ...item, ...updatedAddress }
                : item
            )
          );
          setShowForm(false);
          setEditingAddress(null);
        },
        token
      );
      getAddresses(setAddressList, token);
    } catch (error) {
      console.error("Lỗi khi cập nhật địa chỉ:", error);
    }
  };

  const handleDeleteAddress = async (id) => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa địa chỉ này không?"
    );
    if (!isConfirmed) return;

    try {
      await deleteAddress(
        id,
        () => {
          setAddressList((prev) => prev.filter((item) => item.id !== id));
        },
        token
      );
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
    }
  };

  return (
    <main className="p-4 font-manrope">
      <h1 className="text-xl font-semibold">Địa chỉ của bạn</h1>
      {!showForm ? (
        <div className="grid grid-cols-2 items-center gap-7 mt-7">
          {addressList.length > 0 ? (
            addressList.map((address) => (
              <div
                key={address.id}
                className="px-2 py-4 box-shadow rounded-md h-32"
              >
                <p>
                  <span className="font-medium pr-4 border-r-2">
                    {address.name}
                  </span>{" "}
                  <span className="opacity-70 pl-4 text-sm">
                    {address.phone}
                  </span>
                </p>
                <p className="opacity-70 text-sm mt-1">{address.address}</p>
                <p className="opacity-70 text-sm mt-1">
                  {address.district}, {address.city}
                </p>
                <p className="flex justify-end gap-2 text-sm text-[#08f] mr-2">
                  <button onClick={() => handleEditAddress(address)}>
                    Cập nhật
                  </button>
                  <button onClick={() => handleDeleteAddress(address.id)}>
                    Xóa
                  </button>
                </p>
              </div>
            ))
          ) : (
            <p>Không có địa chỉ</p>
          )}
          <div
            onClick={() => {
              setShowForm(true);
              setEditingAddress(null);
              setFormAddress({ address: "", district: "", city: "" });
            }}
            className="h-32 flex-center box-shadow rounded-md text-4xl"
          >
            <button>
              <CiSquarePlus />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 p-4 box-shadow rounded-md">
          <h2 className="text-lg font-semibold mb-4">
            {editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
          </h2>
          <input
            type="text"
            placeholder="Nhập tên của bạn"
            value={formAddress.name}
            onChange={(e) =>
              setFormAddress({ ...formAddress, name: e.target.value })
            }
            className="border p-2 rounded-md w-full mb-2"
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
          <input
            type="text"
            placeholder="Nhập số điện thoại của bạn"
            value={formAddress.phone}
            onChange={(e) =>
              setFormAddress({ ...formAddress, phone: e.target.value })
            }
            className="border p-2 rounded-md w-full mb-2"
          />
          {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          <input
            type="text"
            placeholder="Địa chỉ chi tiết"
            value={formAddress.address}
            onChange={(e) =>
              setFormAddress({ ...formAddress, address: e.target.value })
            }
            className="border p-2 rounded-md w-full mb-2"
          />
          {errors.address && <p className="text-red-500">{errors.address}</p>}
          <select
            value={formAddress.city}
            onChange={handleCityChange}
            className="border p-2 rounded-md w-full mb-2"
          >
            <option value="">-- Chọn Thành phố --</option>
            {Object.keys(vietnamData).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && <p className="text-red-500">{errors.city}</p>}
          <select
            value={formAddress.district}
            onChange={handleDistrictChange}
            className="border p-2 rounded-md w-full mb-4"
            disabled={!formAddress.city}
          >
            <option value="">-- Chọn Quận/Huyện --</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          {errors.district && <p className="text-red-500">{errors.district}</p>}
          <button
            onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            {editingAddress ? "Cập nhật" : "Lưu"}
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="ml-2 bg-gray-300 py-2 px-4 rounded-md"
          >
            Hủy
          </button>
        </div>
      )}
    </main>
  );
}

export default Address;
