import { createBrowserRouter } from "react-router-dom";
import AppProviders from "./AppProviders";

import Home from "../features/home/Home";
import Products from "../features/products/Products";
import Booking from "../features/booking/Booking";
import Cart from "../features/cart/Cart";
import Profile from "../features/user/Profile";
import PageNotFound from "../ui/PageNotFound";
import Layout from "../ui/Layout";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import OrderConfirmation from "../features/order/OrderConfirmation";
import Orders from "../features/order/Orders";
import OrderDetails from "../features/order/OrderDetails";
import ProductDetails from "../features/products/ProductDetails";
import Wishlist from "../features/wishlist/Wishlist";
import EditProfile from "../features/user/EditProfile";
import Checkout from "../features/checkout/Checkout";

// Admin Imports
import AdminRoute from "../features/admin/AdminRoute";
import AdminLayout from "../features/admin/AdminLayout";
import Dashboard from "../features/admin/dashboard/Dashboard";
import ProductsManagement from "../features/admin/products/ProductsManagement";
import CategoriesManagement from "../features/admin/categories/CategoriesManagement";
import OrdersManagement from "../features/admin/orders/OrdersManagement";
import UsersManagement from "../features/admin/users/UsersManagement";
import AdminSettings from "../features/admin/settings/AdminSettings";

export const router = createBrowserRouter([
  {
    element: <AppProviders />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: "products", element: <Products /> },
          { path: "products/:id", element: <ProductDetails /> },
          { path: "booking", element: <Booking /> },
          { path: "cart", element: <Cart /> },
          { path: "wishlist", element: <Wishlist /> },
          { path: "checkout", element: <Checkout /> },
          { path: "order/confirmation", element: <OrderConfirmation /> },
          {
            path: "orders",
            element: (
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            ),
          },
          {
            path: "order/:id",
            element: (
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            ),
          },
          { path: "login", element: <Login /> },
          { path: "signup", element: <Signup /> },
          {
            path: "profile",
            element: (
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            ),
          },
          {
            path: "editprofile",
            element: (
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: "products", element: <ProductsManagement /> },
          { path: "categories", element: <CategoriesManagement /> },
          { path: "orders", element: <OrdersManagement /> },
          { path: "users", element: <UsersManagement /> },
          { path: "settings", element: <AdminSettings /> },
        ],
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);
