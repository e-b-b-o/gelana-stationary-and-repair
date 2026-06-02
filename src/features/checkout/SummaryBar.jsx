export function SummaryBar({ text }) {
  if (!text) return null;
  return (
    <div className="mb-6 rounded-md bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700 font-medium">
      {text}
    </div>
  );
}
