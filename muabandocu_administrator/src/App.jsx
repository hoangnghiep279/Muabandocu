import { Route, Routes } from "react-router-dom";
import LayoutWeb from "./components/layout/LayoutWeb";
import Home from "./pages/Home";
import Login from "./pages/Login";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutWeb />}>
        <Route index element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  );
};

export default App;
