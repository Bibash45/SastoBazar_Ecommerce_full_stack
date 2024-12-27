import React from "react";
import ReactDOM from "react-dom/client";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
import App from "./App";
import HomeScreen from "./screens/HomeScreen.jsx";
import ProductScreen from "./screens/ProductScreen";
import { Provider } from "react-redux";
import store from "./store.js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { HelmetProvider } from "react-helmet-async";
import CartScreen from "./screens/CartScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ShippingScreen from "./screens/ShippingScreen.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import PaymentScreen from "./screens/PaymentScreen.jsx";
import PlaceOrderScreen from "./screens/PlaceOrderScreen.jsx";
import OrderScreen from "./screens/OrderScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import OrderListScreen from "./screens/admin/OrderListScreen.jsx";
import ProductListScreen from "./screens/admin/ProductListScreen.jsx";
import ProductEditScreen from "./screens/admin/ProductEditScreen.jsx";
import UserListScreen from "./screens/admin/UserListScreen.jsx";
import UserEditScreen from "./screens/admin/UserEditScreen.jsx";
import ResetPassword from "./screens/ResetPassword.jsx";
import ForgotPassword from "./screens/ForgotPassword.jsx";
import ProductAddScreen from "./screens/admin/ProductAddScreen.jsx";
import AdminOrderDetails from "./screens/admin/AdminOrderDetails.jsx";
import DashboardScreen from "./screens/admin/DashboardScreen.jsx";
import CategoryListScreen from "./screens/admin/CategoryListScreen.jsx";
import CategoryAddScreen from "./screens/admin/CategoryAddScreen.jsx";
import ReportsScreen from "./screens/admin/ReportsScreen.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Main layout component
    children: [
      {
        index: true,
        path: "/",
        element: <HomeScreen />, // Home page
      },
      {
        path: "search/:keyword",
        element: <HomeScreen />, // Search results
      },
      {
        path: "page/:pageNumber",
        element: <HomeScreen />, // Paginated results
      },
      {
        path: "search/:keyword/page/:pageNumber",
        element: <HomeScreen />, // Combined search and pagination
      },
      {
        path: "page/:pageNumber/search/:keyword",
        element: <HomeScreen />, // Alternative combined search and pagination
      },
      {
        path: "product/:id",
        element: <ProductScreen />, // Product details
      },
      {
        path: "cart",
        element: <CartScreen />, // Cart page
      },
      {
        path: "login",
        element: <LoginScreen />, // Login page
      },
      {
        path: "register",
        element: <RegisterScreen />, // Registration page
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />, // Forgot password page
      },
      {
        path: "reset-password",
        element: <ResetPassword />, // Reset password page
      },
      {
        path: "",
        element: <PrivateRoute />, // Private route wrapper
        children: [
          {
            path: "shipping",
            element: <ShippingScreen />, // Shipping page
          },
          {
            path: "payment",
            element: <PaymentScreen />, // Payment page
          },
          {
            path: "placeorder",
            element: <PlaceOrderScreen />, // Place order page
          },
          {
            path: "order/:orderId",
            element: <OrderScreen />, // Order details
          },
          {
            path: "profile",
            element: <ProfileScreen />, // User profile
          },
        ],
      },
    ],
  },

  {
    path: "/admin",
    element: <AdminRoute />, // Admin route wrapper
    children: [
      {
        index: true,
        element: <DashboardScreen />, // Admin order list
      },
      {
        path: "orderlist",
        element: <OrderListScreen />, // Admin order list
      },
      {
        path: "orderlist/:pageNumber",
        element: <OrderListScreen />, // Admin order list
      },
      {
        path: "orderlist/search/:keyword",
        element: <OrderListScreen />, // Admin order list
      },
      {
        path: "orderlist/:pageNumber/search/:keyword",
        element: <OrderListScreen />, // Admin order list
      },
      {
        path: "orderlist/search/:keyword/:pageNumber",
        element: <OrderListScreen />, // Admin order list
      },
      {
        path: "orderdetail/:orderId",
        element: <AdminOrderDetails />, // Admin order list
      },
      {
        path: "productlist",
        element: <ProductListScreen />, // Admin product list
      },

      {
        path: "productlist/:pageNumber",
        element: <ProductListScreen />, // Paginated product list
      },
      {
        path: "productlist/search/:keyword",
        element: <ProductListScreen />, // Paginated product list
      },
      {
        path: "productlist/:pageNumber/search/:keyword",
        element: <ProductListScreen />, // Paginated product list
      },
      {
        path: "productlist/search/:keyword/:pageNumber",
        element: <ProductListScreen />, // Paginated product list
      },
      {
        path: "productlist/search/:category",
        element: <ProductListScreen />, // Paginated product list
      },
      {
        path: "productlist/search/:minPrice/:maxprice",
        element: <ProductListScreen />, // Paginated product list
      },
      {
        path: "product/add",
        element: <ProductAddScreen />, // Paginated product list
      },
      {
        path: "product/:id/edit",
        element: <ProductEditScreen />, // Product edit page
      },
      {
        path: "userlist",
        element: <UserListScreen />, // Admin user list
      },
      {
        path: "userlist/:pageNumber",
        element: <UserListScreen />, // Admin user list
      },
      {
        path: "userlist/search/:keyword",
        element: <UserListScreen />, // Admin user list
      },
      {
        path: "userlist/:pageNumber/search/:keyword",
        element: <UserListScreen />, // Admin user list
      },
      {
        path: "userlist/search/:keyword/:pageNumber",
        element: <UserListScreen />, // Admin user list
      },
      {
        path: "user/:id/edit",
        element: <UserEditScreen />, // User edit page
      },
      {
        path: "categorylist",
        element: <CategoryListScreen />, // User edit page
      },
      {
        path: "categorylist/:pageNumber",
        element: <CategoryListScreen />, // User edit page
      },
      {
        path: "categorylist/search/:keyword",
        element: <CategoryListScreen />, // User edit page
      },
      {
        path: "categorylist/:pageNumber/search/:keyword",
        element: <CategoryListScreen />, // User edit page
      },
      {
        path: "categorylist/search/:keyword/:pageNumber",
        element: <CategoryListScreen />, // User edit page
      },
      {
        path: "category/add",
        element: <CategoryAddScreen />, // User edit page
      },
      {
        path: "reports",
        element: <ReportsScreen />, // User edit page
      },
    ],
  },
]);

console.log("GOOGLE CLIENT ID : ", process.env.REACT_APP_GOOGLE_CLIENT_ID);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1031298587882-qsd7q4mv1p3iqo124h9pmfgch9cbluu0.apps.googleusercontent.com">
      <HelmetProvider>
        <Provider store={store}>
          <PayPalScriptProvider deferLoading={true}>
            <RouterProvider router={router} />
          </PayPalScriptProvider>
        </Provider>
      </HelmetProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
