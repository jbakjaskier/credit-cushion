import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const baseStyle = "px-4 py-2 rounded-md font-medium transition-colors duration-200";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 