import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LayoutAdmin from "./admin/Layoutadmin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import LayoutManager from "./manager/Layoutmanager";
import ManagerDashboard from "./manager/pages/ManagerDashboard";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import ProductDetail from "./manager/pages/ProductDetail";
import AdminProductDetail from "./admin/pages/Productdetail";
import Category from "./admin/pages/categoriespage/Category";
import AddCate from "./admin/pages/categoriespage/AddCate";
import EditCategory from "./admin/pages/categoriespage/EditCategory";
import ManagerAccount from "./admin/pages/managerpage/ManagerAccount";
import AddManager from "./admin/pages/managerpage/AddManager";
import UserAccount from "./admin/pages/UserAccount";
import RevenueAdmin from "./admin/pages/RevenueAdmin";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userPermission = localStorage.getItem("permission");
    setIsAuthenticated(!!token);
    setPermission(userPermission);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            permission === "1" ? (
              <Navigate to="/admin" />
            ) : permission === "2" ? (
              <Navigate to="/manager" />
            ) : (
              <Navigate to="/login" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {isAuthenticated && permission === "1" && (
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<RevenueAdmin />} />
          <Route path="product/:id" element={<AdminProductDetail />} />
          <Route path="/admin/category" element={<Category />} />
          <Route path="/admin/category/add" element={<AddCate />} />
          <Route path="/admin/category/edit/:id" element={<EditCategory />} />
          <Route path="/admin/managerAccount" element={<ManagerAccount />} />
          <Route path="/admin/managerAccount/add" element={<AddManager />} />
          <Route path="/admin/userAccount" element={<UserAccount />} />
          <Route path="/admin/product" element={<AdminDashboard />} />
        </Route>
      )}

      {isAuthenticated && permission === "2" && (
        <Route path="/manager" element={<LayoutManager />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="product/:id" element={<ProductDetail />} />
        </Route>
      )}

      <Route
        path="/login"
        element={
          <Login
            onLoginSuccess={() => {
              setIsAuthenticated(true);
              setPermission(localStorage.getItem("permission"));
            }}
          />
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
