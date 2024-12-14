function Validation(values, fields = []) {
  const error = {};

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const phoneRegex = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/;

  // Validate email
  if (fields.includes("email")) {
    if (!values.email || values.email.trim() === "") {
      error.email = "Vui lòng nhập email";
    } else if (!emailRegex.test(values.email)) {
      error.email = "Email không hợp lệ";
    }
  }

  // Validate phone
  if (fields.includes("phone")) {
    if (!values.phone || values.phone.trim() === "") {
      error.phone = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(values.phone)) {
      error.phone = "Số điện thoại không hợp lệ";
    }
  }

  // Validate password
  if (fields.includes("password")) {
    if (!values.password || values.password.trim() === "") {
      error.password = "Vui lòng nhập mật khẩu";
    } else if (values.password.length < 6) {
      error.password = "Mật khẩu phải ít nhất 6 ký tự";
    }
  }

  // Validate name
  if (fields.includes("name")) {
    if (!values.name || values.name.trim() === "") {
      error.name = "Vui lòng nhập tên của bạn";
    }
  }

  // Validate confirmPassword
  if (fields.includes("confirmPassword")) {
    if (!values.confirmPassword || values.confirmPassword.trim() === "") {
      error.confirmPassword = "Vui lòng xác nhận lại mật khẩu";
    } else if (values.confirmPassword !== values.password) {
      error.confirmPassword = "Mật khẩu không khớp nhau";
    }
  }

  return error;
}

function ValidationProduct(values, fields = [], files = []) {
  const error = {};

  const priceRegex = /^[0-9]+$/;
  const linkRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9]+\.[a-zA-Z]{2,}(\S*)$/;

  // Validate title
  if (fields.includes("title")) {
    if (!values.title || values.title.trim() === "") {
      error.title = "Vui lòng nhập tên sản phẩm";
    }
  }

  // Validate categoryId
  if (fields.includes("categoryId")) {
    if (!values.categoryId || values.categoryId.trim() === "") {
      error.categoryId = "Vui lòng chọn loại sản phẩm";
    }
  }

  // Validate price
  if (fields.includes("price")) {
    if (!values.price || values.price.trim() === "") {
      error.price = "Vui lòng nhập giá sản phẩm";
    } else if (!priceRegex.test(values.price)) {
      error.price = "Giá sản phẩm phải là số hợp lệ";
    }
  }

  // Validate description
  if (fields.includes("description")) {
    if (!values.description || values.description.trim() === "") {
      error.description = "Vui lòng nhập mô tả sản phẩm";
    }
  }

  // Validate linkzalo
  if (fields.includes("linkzalo")) {
    if (
      values.linkzalo &&
      values.linkzalo.trim() !== "" &&
      !linkRegex.test(values.linkzalo)
    ) {
      error.linkzalo = "Liên kết Zalo không hợp lệ";
    }
  }

  // Validate warranty
  if (fields.includes("warranty")) {
    if (values.warranty && values.warranty.trim() === "") {
      error.warranty = "Vui lòng nhập thông tin bảo hành";
    }
  }

  // Validate shipfee
  if (fields.includes("shipfee")) {
    if (!values.shipfee || values.shipfee.trim() === "") {
      error.shipfee = "Vui lòng nhập phí vận chuyển";
    } else if (!priceRegex.test(values.shipfee)) {
      error.shipfee = "Phí vận chuyển phải là số hợp lệ";
    }
  }

  // Validate files (ảnh sản phẩm)
  if (files.length === 0) {
    error.files = "Vui lòng tải lên ít nhất một ảnh sản phẩm";
  } else {
    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
    const invalidFiles = Array.from(files).filter((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      return !allowedExtensions.includes(fileExtension);
    });

    if (invalidFiles.length > 0) {
      error.files = "Chỉ hỗ trợ các định dạng ảnh: jpg, jpeg, png, gif";
    }
  }

  return error;
}

function ValidationCheckout(values, fields = []) {
  const error = {};

  // Validate address
  if (fields.includes("address")) {
    if (!values.address || values.address.trim() === "") {
      error.address = "Vui lòng nhập địa chỉ";
    }
  }

  // Validate district
  if (fields.includes("district")) {
    if (!values.district || values.district.trim() === "") {
      error.district = "Vui lòng chọn quận/huyện";
    }
  }

  // Validate city
  if (fields.includes("city")) {
    if (!values.city || values.city.trim() === "") {
      error.city = "Vui lòng chọn thành phố";
    }
  }

  return error;
}

export { Validation, ValidationProduct, ValidationCheckout };
