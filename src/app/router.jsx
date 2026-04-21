import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";
import Booking from "../pages/Booking";
import Cart from "../pages/Cart";
import Profile from "../pages/Profile";
import PageNotFound from "../pages/PageNotFound";
import Layout from "../components/Layout";
import Login from "../pages/Login";

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
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
