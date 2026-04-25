const AlertMessage = ({
  type = 'info',
  title,
  message,
  className = '',
}) => {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    success: 'bg-green-500/10 border-green-500/30 text-green-300',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
    error: 'bg-red-500/10 border-red-500/30 text-red-300',
  };

  return (
    <div
      className={`
        rounded-lg border p-3 text-sm
        ${styles[type] || styles.info}
        ${className}
      `}
    >
      {title && <p className="font-semibold mb-1">{title}</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default AlertMessage;