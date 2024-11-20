import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Breadcrumbs() {
  const location = useLocation();
  const [productTitle, setProductTitle] = useState(null);
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Nếu là trang Home, không hiển thị breadcrumb
  if (location.pathname === "/") {
    return null;
  }

  // Kiểm tra nếu đang ở trang chi tiết sản phẩm
  useEffect(() => {
    if (pathnames[0] === "product" && pathnames[1]) {
      const productId = pathnames[1];

      const fetchProductTitle = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/products/${productId}`
          );
          setProductTitle(response.data.data.title); // Giả sử title nằm trong response.data.data
        } catch (error) {
          console.error("Lỗi khi lấy tên sản phẩm:", error);
        }
      };

      fetchProductTitle();
    }
  }, [pathnames]);

  return (
    <nav className="text-lg">
      <NavLink to="/" className="text-[#005D63]">
        Home &gt;
      </NavLink>
      {pathnames.map((crumb, index) => {
        const capitalizedCrumb = crumb.charAt(0).toUpperCase() + crumb.slice(1);
        const pathTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return (
          <span key={index} className="text-[#005D63] mx-2">
            {!isLast ? (
              <NavLink to={pathTo}>{capitalizedCrumb} &gt;</NavLink>
            ) : (
              <span>{productTitle || capitalizedCrumb}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
