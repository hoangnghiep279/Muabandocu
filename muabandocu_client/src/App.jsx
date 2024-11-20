import { Route, Routes } from "react-router-dom";
import LayoutWeb from "./components/layout/LayoutWeb";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Signin from "./pages/SignIn";
import Detailproduct from "./pages/Detailproduct";
import SearchResult from "./pages/SearchResult";
import Contact from "./pages/Contact";
import Account from "./pages/Account";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutWeb />}>
        <Route index element={<Home />} />
        <Route path="product" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/product/:id" element={<Detailproduct />} />
        <Route path="/account" element={<Account />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="signin" element={<Signin />} />
      {/* <Route path="*" element={<Page404 />} /> */}
    </Routes>
  );
};

export default App;
