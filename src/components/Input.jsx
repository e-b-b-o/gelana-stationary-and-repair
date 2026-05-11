import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function Input() {
  return (
    <div className="relative flex items-center min-w-0 w-full max-w-[160px] lg:max-w-[220px]">
      <MagnifyingGlassIcon className="w-4 absolute left-2 shrink-0" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full outline-0 pl-7 pr-2 py-1 text-sm border border-gray-300 rounded-md"
      />
    </div>
  );
}

export default Input;
