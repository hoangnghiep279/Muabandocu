function Validation(values) {
  const error = {};
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  // Kiểm tra email
  if (values.email === "") {
    error.email = "Vui lòng nhập email";
  } else if (!emailRegex.test(values.email)) {
    error.email = "Email không hợp lệ";
  }

  // Kiểm tra password
  if (values.password.trim() === "") {
    error.password = "Vui lòng nhập mật khẩu";
  } else if (values.password.length < 6) {
    error.password = "Mật khẩu phải ít nhất 6 ký tự";
  }

  if (values.name && values.name.trim() === "") {
    error.name = "Vui lòng nhập tên của bạn";
  }

  // Kiểm tra confirm password (chỉ khi tồn tại)
  if (values.confirmPassword && values.confirmPassword.trim() === "") {
    error.confirmPassword = "Vui lòng xác nhận lại mật khẩu";
  } else if (
    values.confirmPassword &&
    values.confirmPassword !== values.password
  ) {
    error.confirmPassword = "Mật khẩu không khớp nhau";
  }

  return error;
}

export default Validation;
