interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
