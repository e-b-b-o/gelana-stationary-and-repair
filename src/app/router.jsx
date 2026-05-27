import { createBrowserRouter } from "react-router-dom";

import Home from "../features/home/Home";
import Products from "../features/products/Products";
import Booking from "../features/booking/Booking";
import Cart from "../features/cart/Cart";
import Profile from "../features/user/Profile";
import PageNotFound from "../ui/PageNotFound";
import Layout from "../ui/Layout";
import Login from "../features/auth/login";
import Signup from "../features/auth/signup";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "booking", element: <Booking /> },
      { path: "cart", element: <Cart /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
