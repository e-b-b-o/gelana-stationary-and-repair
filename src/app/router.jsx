import { createBrowserRouter } from "react-router-dom";

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
import { Order } from "../features/order/Order";
import Wishlist from "../features/wishlist/Wishlist";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "booking", element: <Booking /> },
      { path: "cart", element: <Cart /> },
      { path: "wishlist", element: <Wishlist /> },
      { path: "order", element: <Order /> },
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
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
