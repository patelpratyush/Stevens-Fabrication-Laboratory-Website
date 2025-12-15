// Reusable button component
export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
}) {
  const baseClasses = "font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: "bg-stevens-maroon text-white hover:bg-red-800 focus:ring-stevens-maroon disabled:bg-gray-400",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-400",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-gray-400",
    outline: "border-2 border-stevens-maroon text-stevens-maroon hover:bg-red-50 focus:ring-stevens-maroon disabled:border-gray-300 disabled:text-gray-400",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled || loading ? "cursor-not-allowed opacity-60" : ""}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

/* Usage examples:
<Button onClick={handleSubmit}>Submit Order</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger" onClick={handleDelete}>Delete</Button>
<Button loading={isSubmitting}>Submit</Button>
<Button size="sm" variant="outline">Edit</Button>
*/
