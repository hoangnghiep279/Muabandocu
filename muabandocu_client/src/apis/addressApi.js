import axios from "axios";
import { toast } from "react-toastify";

const baseURL = "http://localhost:3000/address";

const getAddresses = async (setAddresses, token) => {
  try {
    const response = await axios.get("http://localhost:3000/address", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.data.length === 0) {
      console.log("không có địa chỉ nào ");
    } else {
      setAddresses(response.data.data);
    }
  } catch (error) {
    console.log("có lỗi xảy ra");
  }
};

// Thêm địa chỉ mới
const addAddress = async (addressData, onSuccess, token) => {
  try {
    const response = await axios.post(baseURL, addressData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast("Thêm địa chỉ thành công!", { type: "success" });
    onSuccess(response.data);
  } catch (error) {
    toast(error.response?.data?.message || "Thêm địa chỉ thất bại!", {
      type: "error",
    });
    throw error;
  }
};

// Cập nhật địa chỉ
const updateAddress = async (id, addressData, onSuccess, token) => {
  try {
    const response = await axios.put(`${baseURL}/${id}`, addressData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast("Cập nhật địa chỉ thành công!", { type: "success" });
    onSuccess(response.data);
  } catch (error) {
    toast(error.response?.data?.message || "Cập nhật địa chỉ thất bại!", {
      type: "error",
    });
    throw error;
  }
};
// Xóa địa chỉ
const deleteAddress = async (id, onSuccess, token) => {
  try {
    await axios.delete(`${baseURL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast("Xóa địa chỉ thành công!", { type: "success" });
    onSuccess();
  } catch (error) {
    toast(error.response?.data?.message || "Xóa địa chỉ thất bại!", {
      type: "error",
    });
    throw error;
  }
};

export { getAddresses, addAddress, updateAddress, deleteAddress };
