import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LayoutWeb from "./components/layout/LayoutWeb";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Signin from "./pages/SignIn";
import Detailproduct from "./pages/Detailproduct";
import SearchResult from "./pages/SearchResult";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import Profile from "./components/Profile";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route path="/" element={<LayoutWeb />}>
        <Route index element={<Home />} />
        <Route path="product" element={<Product />} />
        <Route path="/product/category/:categoryId" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/product/:id" element={<Detailproduct />} />

        <Route
          path="/account"
          element={isAuthenticated ? <Account /> : <NotFound />}
        />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
