import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data yet", 
  message = "Get started by adding your first item",
  icon = "Inbox",
  action,
  actionText = "Add New"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 px-4">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
        <ApperIcon name={icon} size={48} className="text-primary" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
      </div>
      {action && (
        <button
          onClick={action}
          className="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200 min-h-[48px] flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={20} />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default Empty;