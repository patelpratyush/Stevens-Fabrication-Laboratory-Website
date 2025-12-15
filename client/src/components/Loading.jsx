// Loading spinner component
export function Spinner({ size = "md" }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-gray-300 border-t-stevens-maroon rounded-full animate-spin`}
      ></div>
    </div>
  );
}

// Full page loading state
export function LoadingPage({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}

// Skeleton loader for cards
export function SkeletonCard() {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
  );
}

// Skeleton loader for table rows
export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="animate-pulse">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="border-b border-gray-200 py-3 flex gap-4">
          {[...Array(cols)].map((_, j) => (
            <div
              key={j}
              className="h-4 bg-gray-200 rounded flex-1"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
