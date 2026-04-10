const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-zinc-700 rounded ${className}`}></div>
  );
};

export default Skeleton;