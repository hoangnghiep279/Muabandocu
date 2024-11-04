import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LayoutWeb from "./components/layout/LayoutWeb";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Login from "./pages/Login";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutWeb />}>
        <Route index element={<Home />} />
        <Route path="product" element={<Product />} />
      </Route>
      <Route path="login" element={<Login />} />
    </Routes>
  );
};

export default App;
