import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

{
  /* Redux Setup */
}
import { Provider } from "react-redux";
import store from "./redux/Store";

{
  /* Public Pages */
}
import LoginPage from "./pages/auth/loginPage";
// import RegisterPage from "./pages/Register";

{
  /* Auth Protected Routes */
}
import ProtectedRoutes from "./ProtectedRoutes";

import "./index.css";
import Dashboard from "./pages/dashboard/dashboard";
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        {/* Protected Refresh Token Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
