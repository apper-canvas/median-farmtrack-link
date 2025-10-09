import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 px-4">
      <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertCircle" size={40} className="text-error" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-gray-900">Oops!</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200 min-h-[48px]"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;