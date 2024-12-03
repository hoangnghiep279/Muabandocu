import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductTitle } from "../apis/ProductApi";
function Breadcrumbs() {
  const location = useLocation();
  const [productTitle, setProductTitle] = useState(null);
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (location.pathname === "/") {
    return null;
  }

  useEffect(() => {
    if (pathnames[0] === "product" && pathnames[1]) {
      const id = pathnames[1];

      fetchProductTitle(setProductTitle, id);
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
