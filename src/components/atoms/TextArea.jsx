import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const TextArea = forwardRef(({ 
  label,
  error,
  className,
  rows = 4,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-200 text-gray-900 bg-white resize-none",
          error && "border-error",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

TextArea.displayName = "TextArea";

export default TextArea;