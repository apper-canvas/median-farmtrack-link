import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-gray-200 text-gray-800",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    info: "bg-info/10 text-info"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;