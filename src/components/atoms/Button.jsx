import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md",
  className,
  ...props 
}, ref) => {
  const baseStyles = "font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]",
    secondary: "bg-secondary text-white hover:bg-secondary/90 active:scale-[0.98]",
    accent: "bg-accent text-white hover:bg-accent/90 active:scale-[0.98]",
    outline: "border-2 border-primary text-primary hover:bg-primary/10 active:scale-[0.98]",
    ghost: "text-primary hover:bg-primary/10 active:scale-[0.98]"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[40px]",
    md: "px-6 py-3 text-base min-h-[48px]",
    lg: "px-8 py-4 text-lg min-h-[56px]"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;