const Select = ({
  label,
  value,
  onChange,
  options,
  required = false,
  ...props
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1 text-zinc-400">
        {label} {required && '*'}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-blue-500 text-white"
        {...props}
      >
        <option value="">Selecione...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;