import Button from "../../../ui/Button";

export default function AdminSettings() {
  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-primary">Settings</h1>
        <p className="text-muted">Manage your store preferences.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm space-y-8">
        {/* STORE INFO */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-primary border-b border-gray-100 pb-2">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Store Name</label>
              <input type="text" defaultValue="Gelana Stationary" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-primary text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Contact Email</label>
              <input type="email" defaultValue="admin@gelana.com" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-primary text-sm" />
            </div>
          </div>
        </section>

        {/* NOTIFICATIONS */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-primary border-b border-gray-100 pb-2">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
              <span className="text-sm text-gray-700 font-medium">Email me when a new order is placed</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
              <span className="text-sm text-gray-700 font-medium">Email me when a product is out of stock</span>
            </label>
          </div>
        </section>

        <div className="pt-4 flex justify-end">
          <Button variant="primary" size="md">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
