import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
function Input() {
  return (
    <div className="relative flex items-center min-w-0">
      <MagnifyingGlassIcon className="w-5 absolute left-1.5" />
      <input
        type="text"
        placeholder="Search here..."
        className="outline-0 px-8 py-1 text-sm  border border-gray-900 min-w-0"
      />
    </div>
  );
}

export default Input;
