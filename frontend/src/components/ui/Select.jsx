const Select = ({
  label,
  value,
  onChange,
  options = [],
  error,
  helperText,
  required = false,
  className = '',
  placeholder = 'Selecione...',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-1 text-zinc-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        className={`
          w-full p-3 rounded-lg bg-zinc-800 border text-white
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/40
          ${
            error
              ? 'border-red-500'
              : 'border-zinc-700 focus:border-blue-500'
          }
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-zinc-500 text-sm mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Select;