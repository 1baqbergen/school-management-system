// src/components/dashboard/DashboardSkeleton.tsx
const SkeletonCard = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse" />
    </div>
    <div className="mt-4 h-6 w-32 bg-gray-200 rounded animate-pulse" />
  </div>
);

const SkeletonChart = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
    <div className="h-80 w-full bg-gray-100 rounded-xl animate-pulse" />
  </div>
);

const SkeletonTable = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
    </div>
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart />
        <SkeletonChart />
      </div>

      {/* Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonTable />
        <SkeletonTable />
      </div>
    </div>
  );
};