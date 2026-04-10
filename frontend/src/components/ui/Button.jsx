const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseClasses = 'w-full p-3 rounded-lg font-semibold transition-colors';
  const variants = {
    primary: 'bg-[#003366] hover:bg-[#002244] text-white',
    secondary: 'bg-zinc-700 hover:bg-zinc-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
};

export default Button;