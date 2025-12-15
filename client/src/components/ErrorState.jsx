// Error state component
export default function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error. Please try again.",
  onRetry
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-stevens-maroon text-white rounded-lg hover:bg-red-800 transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// Inline error message
export function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
      <p className="text-sm">{message}</p>
    </div>
  );
}

// Empty state (when there's no data)
export function EmptyState({
  icon = "📭",
  title = "No items found",
  message = "There's nothing here yet.",
  action
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {action}
    </div>
  );
}
