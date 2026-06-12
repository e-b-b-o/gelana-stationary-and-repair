/**
 * Reusable Skeleton Loading Components
 * Consistent pulse animation, border radius, and spacing across the app.
 */

function SkeletonBox({ className = "" }) {
  return (
    <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
  );
}

/** A single skeleton line of text */
function SkeletonText({ className = "w-full h-4" }) {
  return <SkeletonBox className={className} />;
}

/** Skeleton for a product card (matches ProductCard layout) */
export function SkeletonProductCard() {
  return (
    <div className="p-4 rounded-sm bg-white shadow-sm space-y-3">
      <SkeletonBox className="h-52 sm:h-60 w-full rounded-sm" />
      <SkeletonText className="w-3/4 h-4" />
      <SkeletonText className="w-1/3 h-3" />
      <SkeletonText className="w-1/2 h-4" />
      <SkeletonText className="w-1/4 h-3" />
      <SkeletonBox className="w-28 h-9 rounded-md" />
    </div>
  );
}

/** Skeleton for a list row item (Cart / Wishlist) */
export function SkeletonListItem() {
  return (
    <div className="flex gap-4 p-4 sm:p-5">
      <SkeletonBox className="h-5 w-5 rounded shrink-0 mt-1" />
      <SkeletonBox className="h-20 w-20 sm:h-24 sm:w-24 rounded-md shrink-0" />
      <div className="flex-1 min-w-0 space-y-2.5">
        <SkeletonText className="w-3/4 h-4" />
        <SkeletonText className="w-1/2 h-3" />
        <SkeletonText className="w-1/3 h-5 mt-3" />
      </div>
    </div>
  );
}

/** Skeleton for an order card */
export function SkeletonOrderCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-2.5 flex-1">
        <div className="flex items-center gap-3">
          <SkeletonText className="w-28 h-5" />
          <SkeletonBox className="w-16 h-5 rounded-full" />
        </div>
        <SkeletonText className="w-40 h-3" />
        <SkeletonText className="w-32 h-3" />
      </div>
      <SkeletonBox className="w-28 h-9 rounded-md" />
    </div>
  );
}

/** Skeleton for a profile info card */
export function SkeletonProfileCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-5">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonText className="w-40 h-5" />
          <SkeletonText className="w-56 h-3" />
        </div>
        <SkeletonBox className="w-14 h-8 rounded-md" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <SkeletonText className="w-16 h-3" />
            <SkeletonText className="w-32 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton for a stat card */
export function SkeletonStatCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 text-center space-y-2">
      <SkeletonBox className="w-7 h-7 mx-auto rounded" />
      <SkeletonText className="w-8 h-6 mx-auto" />
      <SkeletonText className="w-12 h-3 mx-auto" />
    </div>
  );
}

export { SkeletonBox, SkeletonText };
export default SkeletonBox;
