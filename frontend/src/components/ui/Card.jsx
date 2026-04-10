const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-zinc-900 p-6 rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;