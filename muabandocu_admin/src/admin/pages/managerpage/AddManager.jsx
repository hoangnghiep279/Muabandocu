import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addManager } from "../../api/Userapi";
import { Validation } from "../../../utils/Validation";

function AddManager() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState({});
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (isSubmitted) {
      setError(Validation({ ...values, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const validationErrors = Validation(values);
    setError(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log("Validation Errors:", validationErrors);
      return;
    }
    addManager(values, navigate);
  };
  return (
    <main className="p-5">
      <h1 className="text-xl font-bold mb-4">Thêm Quản Lý</h1>
      <form onSubmit={handleSubmit} className="max-w-full w-[30%]">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Tên Quản Lý
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Nhập tên"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
          {isSubmitted && error.name && (
            <p className="text-red-500 text-sm mt-1">{error.name}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Nhập email"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
          {isSubmitted && error.email && (
            <p className="text-red-500 text-sm mt-1">{error.email}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Mật Khẩu
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
          {isSubmitted && error.password && (
            <p className="text-red-500 text-sm mt-1">{error.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-primaryColor text-white py-2 px-4 rounded hover:opacity-85"
        >
          Thêm Quản Lý
        </button>
      </form>
    </main>
  );
}

export default AddManager;
