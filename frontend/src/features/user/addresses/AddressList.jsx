import { useState } from "react";
import Button from "../../../ui/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useAddress } from "./AddressContext";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import Spinner from "../../../ui/Spinner";

function AddressList() {
  const {
    addresses,
    isLoading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddress();

  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubmit = async (data) => {
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await createAddress(data);
      setIsAdding(false);
    } catch (err) {
      setSubmitError(err.message || "Failed to add address.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (data) => {
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await updateAddress(editingAddress.id, data);
      setEditingAddress(null);
    } catch (err) {
      setSubmitError(err.message || "Failed to update address.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
    } catch (err) {
      alert("Failed to delete address: " + err.message);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
    } catch (err) {
      alert("Failed to set default address: " + err.message);
    }
  };

  if (isLoading && !addresses.length) {
    return (
      <div className="py-10 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      {submitError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
          {submitError}
        </div>
      )}

      {isAdding ? (
        <AddressForm
          onSubmit={handleAddSubmit}
          onCancel={() => {
            setIsAdding(false);
            setSubmitError("");
          }}
          isSubmitting={isSubmitting}
        />
      ) : editingAddress ? (
        <AddressForm
          initialData={editingAddress}
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setEditingAddress(null);
            setSubmitError("");
          }}
          isSubmitting={isSubmitting}
        />
      ) : (
        <>
          {addresses.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-2xl">🗺️</span>
              </div>
              <div>
                <p className="text-gray-500 font-medium">No addresses yet.</p>
                <p className="text-sm text-gray-400">
                  Add an address for faster checkout.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsAdding(true)}
                className="mt-2"
              >
                <PlusIcon className="w-4 h-4 inline mr-1" />
                Add your first address
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  onEdit={(a) => setEditingAddress(a)}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                />
              ))}

              <button
                onClick={() => setIsAdding(true)}
                className="flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 hover:border-primary text-gray-500 hover:text-primary rounded-xl p-6 transition-all duration-200 min-h-[160px]"
              >
                <PlusIcon className="w-8 h-8" />
                <span className="font-semibold">Add New Address</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AddressList;
