const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div
        className={`
          w-full
          ${sizes[size]}
          bg-zinc-900
          border border-zinc-800
          rounded-2xl
          shadow-2xl
          p-6
          relative
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          ✕
        </button>

        {title && (
          <div className="mb-4 pr-8">
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;