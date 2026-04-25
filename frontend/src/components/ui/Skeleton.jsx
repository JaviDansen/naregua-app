const Skeleton = ({
  className = '',
  rounded = 'md',
}) => {
  const roundedClasses = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={`
        animate-pulse
        bg-zinc-800
        ${roundedClasses[rounded]}
        ${className}
      `}
    />
  );
};

export default Skeleton;