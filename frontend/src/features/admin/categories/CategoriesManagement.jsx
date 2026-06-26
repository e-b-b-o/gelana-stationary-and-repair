import { adminMockData } from "../../../data/adminMockData";
import Button from "../../../ui/Button";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function CategoriesManagement() {
  const { categories } = adminMockData;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Categories</h1>
          <p className="text-muted">Organize your products into categories.</p>
        </div>
        <Button variant="primary" size="md" className="flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Add Category
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Item Count</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">#{cat.id}</td>
                  <td className="px-6 py-4 font-bold text-primary">{cat.name}</td>
                  <td className="px-6 py-4 font-semibold text-gray-600">{cat.itemCount}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 text-gray-400 hover:text-primary transition-colors bg-white border border-gray-200 rounded-md shadow-sm">
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white border border-gray-200 rounded-md shadow-sm">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
