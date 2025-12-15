export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="text-4xl mb-3">⚠️</div>
      <p className="text-red-600 text-center mb-4">{message || 'Something went wrong'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-stevens-maroon text-white rounded hover:bg-red-800 text-sm"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
