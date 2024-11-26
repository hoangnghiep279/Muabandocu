const path = require("path");
const fs = require("fs");

async function uploadSingleImage(imageFile) {
  if (!imageFile) {
    return {
      code: 400,
      message: "No image file provided",
    };
  }

  const extension = path.extname(imageFile.originalname);
  const oldPath = imageFile.path;

  const newPath = path.join(
    __dirname,
    "../resources/user-img/",
    imageFile.filename + extension
  );

  await fs.promises.rename(oldPath, newPath);

  const imageUrl = "resources/user-img/" + imageFile.filename + extension;

  return {
    code: 200,
    message: "Upload successful",
    image: imageUrl,
  };
}
async function uploadMultipleImages(imageFiles) {
  const uploadedImages = [];

  for (const file of imageFiles) {
    const extension = path.extname(file.originalname);
    const oldPath = file.path;
    const newPath = path.join(
      __dirname,
      "../resources/products-img/",
      file.filename + extension
    );

    await fs.promises.rename(oldPath, newPath);

    const imageUrl = "resources/products-img/" + file.filename + extension;
    uploadedImages.push(imageUrl);
  }

  return {
    code: 200,
    message: "Upload successful",
    images: uploadedImages,
  };
}
module.exports = {
  uploadMultipleImages,
  uploadSingleImage,
};
