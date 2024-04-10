import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import { MAIN_DASHBOARD_LOGIN, MAIN_DASHBOARD_URL } from "./app/constants";
import { ApolloProvider } from "@apollo/client";
import { client } from "./app/ApolloClient";
import { QueryClient, QueryClientProvider } from "react-query";
import { Suspense, lazy } from "react";

{
  /* Redux Setup */
}
import { Provider } from "react-redux";
import store from "./redux/Store";

{
  /* Public Pages */
}
const Home = lazy(() => import("./pages/Home"));

// import RegisterPage from "./pages/Register";

{
  /* Auth Protected Routes */
}
import ProtectedRoutes from "./ProtectedRoutes";
import Orders from "./pages/dashboard/orders/orders";
import { MoonLoader } from "react-spinners";
import { CreateCoupon } from "./pages/dashboard/coupon/create";

const LoginPage = lazy(() => import("./pages/auth/admin/loginPage"));
const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const Products = lazy(() => import("./pages/dashboard/products/products"));
const CreateProduct = lazy(() => import("./pages/dashboard/products/create"));
const EditProduct = lazy(() => import("./pages/dashboard/products/edit"));
const Coupons = lazy(() => import("./pages/dashboard/coupon/coupons"));

// TODO: Add a loading spinner
const App = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex justify-center items-center">
            <MoonLoader size={25} />
          </div>
        }>
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
            <Route
              path={`${MAIN_DASHBOARD_URL}/coupons`}
              element={<Coupons />}
            />
            <Route
              path={`${MAIN_DASHBOARD_URL}/coupons/create`}
              element={<CreateCoupon />}
            />

            <Route
              path="*"
              element={
                <div className="flex justify-center items-center h-screen">
                  <div className="text-3xl font-bold text-gray-800">
                    404 Not Found
                  </div>
                </div>
              }
            />
          </Route>

          <Route path={`${MAIN_DASHBOARD_URL}/orders`} element={<Orders />} />

          {/* Redirect/Path for handling unmatched routes */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Suspense>
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
