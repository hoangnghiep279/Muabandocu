import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LayoutWeb from "./components/layout/LayoutWeb";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Signin from "./pages/SignIn";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutWeb />}>
        <Route index element={<Home />} />
        <Route path="product" element={<Product />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="signin" element={<Signin />} />
      {/* <Route path="*" element={<Page404 />} /> */}
    </Routes>
  );
};

export default App;
