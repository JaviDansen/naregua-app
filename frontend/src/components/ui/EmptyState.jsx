import Button from './Button';

const EmptyState = ({
  title = 'Nenhum item encontrado',
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`
        text-center py-8 px-4
        ${className}
      `}
    >
      <p className="text-zinc-300 font-semibold">{title}</p>

      {description && (
        <p className="text-zinc-500 text-sm mt-2 max-w-md mx-auto">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <div className="mt-4 flex justify-center">
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;