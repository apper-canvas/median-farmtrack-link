import { cn } from "@/utils/cn";

const Card = ({ children, className, hover = false }) => {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border border-gray-100 p-6",
      hover && "hover:shadow-md transition-shadow duration-200",
      className
    )}>
      {children}
    </div>
  );
};

export default Card;