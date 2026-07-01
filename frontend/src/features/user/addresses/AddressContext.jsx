import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useCallback,
} from "react";
import addressService from "./addressService";
import { useAuth } from "../../auth/AuthContext";

const AddressContext = createContext();

const initialState = {
  addresses: [],
  isLoading: false,
  error: null,
};

function addressReducer(state, action) {
  switch (action.type) {
    case "address/start":
      return { ...state, isLoading: true, error: null };
    case "address/success":
      return {
        ...state,
        isLoading: false,
        addresses: action.payload,
        error: null,
      };
    case "address/fail":
      return { ...state, isLoading: false, error: action.payload };
    case "address/add":
      return {
        ...state,
        isLoading: false,
        addresses: [...state.addresses, action.payload],
      };
    case "address/update":
      return {
        ...state,
        isLoading: false,
        addresses: state.addresses.map((a) =>
          a.id === action.payload.id ? action.payload : a,
        ),
      };
    case "address/delete":
      return {
        ...state,
        isLoading: false,
        addresses: state.addresses.filter((a) => a.id !== action.payload),
      };
    default:
      return state;
  }
}

export function AddressProvider({ children }) {
  const [state, dispatch] = useReducer(addressReducer, initialState);
  const { isAuthenticated } = useAuth();

  const loadAddresses = useCallback(async () => {
    if (!isAuthenticated) return;
    dispatch({ type: "address/start" });
    try {
      const data = await addressService.getAddresses();
      dispatch({ type: "address/success", payload: data || [] });
    } catch (error) {
      // For now, if the backend is not ready, we can just fail silently or log
      console.warn(
        "Could not load addresses (backend may not be implemented):",
        error.message,
      );
      dispatch({ type: "address/fail", payload: error.message });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const createAddress = async (addressData) => {
    dispatch({ type: "address/start" });
    try {
      const newAddress = await addressService.createAddress(addressData);
      dispatch({ type: "address/add", payload: newAddress });
      return newAddress;
    } catch (error) {
      dispatch({ type: "address/fail", payload: error.message });
      throw error;
    }
  };

  const updateAddress = async (id, addressData) => {
    dispatch({ type: "address/start" });
    try {
      const updatedAddress = await addressService.updateAddress(
        id,
        addressData,
      );
      dispatch({ type: "address/update", payload: updatedAddress });
      return updatedAddress;
    } catch (error) {
      dispatch({ type: "address/fail", payload: error.message });
      throw error;
    }
  };

  const deleteAddress = async (id) => {
    dispatch({ type: "address/start" });
    try {
      await addressService.deleteAddress(id);
      dispatch({ type: "address/delete", payload: id });
    } catch (error) {
      dispatch({ type: "address/fail", payload: error.message });
      throw error;
    }
  };

  const setDefaultAddress = async (id) => {
    dispatch({ type: "address/start" });
    try {
      const updatedAddress = await addressService.setDefaultAddress(id);
      // Reloading all addresses to reflect the change of default status correctly across all addresses
      await loadAddresses();
      return updatedAddress;
    } catch (error) {
      dispatch({ type: "address/fail", payload: error.message });
      throw error;
    }
  };

  return (
    <AddressContext.Provider
      value={{
        ...state,
        loadAddresses,
        createAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
}
