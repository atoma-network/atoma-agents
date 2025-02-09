const PulseLoader = () => (
  <div className="flex space-x-2">
    <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
    <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
    <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
  </div>
);

export default PulseLoader;
