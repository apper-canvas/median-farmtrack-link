const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-lg font-medium text-secondary">{text}</p>
    </div>
  );
};

export default Loading;