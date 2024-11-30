import { Route, Routes, Navigate } from "react-router-dom";
import LayoutWeb from "./components/layout/LayoutWeb";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/Notfound";

const isAuthenticated = () => !!localStorage.getItem("token");

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated() ? <LayoutWeb /> : <Navigate to="/login" />}
      />

      {isAuthenticated() && (
        <Route path="/" element={<LayoutWeb />}>
          <Route path="home" element={<Home />} />
        </Route>
      )}

      <Route path="/login" element={<Login />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
