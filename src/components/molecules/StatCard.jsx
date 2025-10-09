import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ title, value, icon, trend, color = "primary" }) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    info: "bg-info/10 text-info"
  };

  return (
    <Card hover className="h-full">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {trend && (
            <p className={`text-sm font-medium ${trend.positive ? 'text-success' : 'text-error'}`}>
              {trend.value}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;