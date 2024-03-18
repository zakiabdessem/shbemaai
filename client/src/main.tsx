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
import LoginPage from "./pages/auth/admin/loginPage";
// import RegisterPage from "./pages/Register";

{
  /* Auth Protected Routes */
}
import ProtectedRoutes from "./ProtectedRoutes";

import "./index.css";
import Dashboard from "./pages/dashboard/dashboard";
import Home from "./pages/Home";
import { MAIN_DASHBOARD_LOGIN, MAIN_DASHBOARD_URL } from "./app/constants";
import Products from "./pages/dashboard/products/products";
import { ApolloProvider } from "@apollo/client";
import { client } from "./app/ApolloClient";
import CreateProduct from "./pages/dashboard/products/create";
import { QueryClient, QueryClientProvider } from "react-query";
import EditProduct from "./pages/dashboard/products/edit";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path={MAIN_DASHBOARD_LOGIN} element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path={`admin/`} element={<Dashboard />} />
          <Route path={`${MAIN_DASHBOARD_URL}/`} element={<Dashboard />} />
          <Route
            path={`${MAIN_DASHBOARD_URL}/products`}
            element={<Products />}
          />
          <Route
            path={`${MAIN_DASHBOARD_URL}/products/create`}
            element={<CreateProduct />}
          />
          <Route
            path={`${MAIN_DASHBOARD_URL}/products/:id`}
            element={<EditProduct />}
          />
        </Route>

        {/* Redirect/Path for handling unmatched routes */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ApolloProvider>
  </Provider>
);
