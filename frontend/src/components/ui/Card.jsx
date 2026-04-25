const Card = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
}) => {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-zinc-900
        border border-zinc-800
        rounded-2xl
        shadow-lg
        ${paddings[padding]}
        ${hover ? 'hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;