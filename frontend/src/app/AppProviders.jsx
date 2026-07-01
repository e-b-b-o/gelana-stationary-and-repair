import { Outlet } from "react-router-dom";
import { AuthProvider } from "../features/auth/AuthContext";
import { CartProvider } from "../features/cart/CartContext";
import { WishlistProvider } from "../features/wishlist/WishlistContext";
import { OrderProvider } from "../features/order/OrderContext";
import { AddressProvider } from "../features/user/addresses/AddressContext";

export default function AppProviders() {
  return (
    <AuthProvider>
      <AddressProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <Outlet />
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </AddressProvider>
    </AuthProvider>
  );
}
