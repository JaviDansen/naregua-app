const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  ...props
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1 text-zinc-400">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full p-3 rounded-lg bg-zinc-800 border ${
          error ? 'border-red-500' : 'border-zinc-700'
        } focus:outline-none focus:border-blue-500 text-white`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;