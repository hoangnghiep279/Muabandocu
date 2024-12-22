import { useState } from "react";
import axios from "axios";

function ConnectMomo({ onLinkSuccess }) {
  const [cardNumber, setCardNumber] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleLink = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/users/link-momo",
        { cardNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onLinkSuccess();
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi liên kết tài khoản MoMo.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Liên kết tài khoản MoMo</h2>
      <form onSubmit={handleLink} className="flex flex-col gap-4">
        <label className="font-semibold">
          Số tài khoản MoMo:
          <input
            type="text"
            value={cardNumber} // Liên kết state `cardNumber`
            onChange={(e) => setCardNumber(e.target.value)} // Cập nhật state
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Liên kết
        </button>
      </form>
    </div>
  );
}

export default ConnectMomo;
