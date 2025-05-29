interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "destacado" | "proximo";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    destacado: "bg-yellow-100 text-yellow-800",
    proximo: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
