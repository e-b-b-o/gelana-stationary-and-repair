import { PencilSquareIcon, TrashIcon, MapPinIcon } from "@heroicons/react/24/outline";

function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  const isDefault = address.isDefault;

  // Derive an icon based on title
  const titleLower = address.title?.toLowerCase() || "";
  const Icon = titleLower.includes("office") || titleLower.includes("work") 
    ? () => <span className="text-xl">🏢</span> 
    : titleLower.includes("home") 
    ? () => <span className="text-xl">🏠</span>
    : () => <MapPinIcon className="w-6 h-6 text-primary" />;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      onDelete(address.id);
    }
  };

  return (
    <div className={`relative bg-white border ${isDefault ? 'border-primary shadow-md ring-1 ring-primary' : 'border-gray-200 shadow-sm'} rounded-xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200`}>
      {isDefault && (
        <span className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
          Default Address
        </span>
      )}
      
      <div className="flex items-start gap-4 mb-4 pr-24">
        <div className="shrink-0 mt-1">
          <Icon />
        </div>
        <div>
          <h4 className="text-lg font-bold text-primary capitalize">{address.title || "Address"}</h4>
          <div className="text-sm text-gray-600 mt-1 space-y-0.5">
            <p>{address.address}</p>
            <p>{address.city}, {address.postalCode}</p>
            <p className="font-medium text-gray-800">{address.country}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
        {!isDefault ? (
          <button 
            onClick={() => onSetDefault(address.id)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Set as Default
          </button>
        ) : (
          <div /> // Spacer
        )}
        
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onEdit(address)}
            className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <PencilSquareIcon className="w-4 h-4" />
            Edit
          </button>
          <button 
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddressCard;
