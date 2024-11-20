const path = require("path");
const fs = require("fs");

async function uploadMultipleImages(imageFiles) {
  const uploadedImages = [];

  for (const file of imageFiles) {
    const extension = path.extname(file.originalname); // Lấy phần mở rộng
    const oldPath = file.path; // Đường dẫn cũ
    const newPath = path.join(
      __dirname,
      "../resources/products-img/",
      file.filename + extension
    ); // Đường dẫn mới

    await fs.promises.rename(oldPath, newPath); // Di chuyển file

    const imageUrl = "resources/products-img/" + file.filename + extension; // Tạo URL
    uploadedImages.push(imageUrl); // Thêm vào danh sách
  }

  return {
    code: 200,
    message: "Upload successful",
    images: uploadedImages,
  };
}
module.exports = {
  uploadMultipleImages,
};
