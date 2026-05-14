import Card from '../../../components/ui/Card';

const ServiceCard = ({ service, onClick }) => {
  const isClickable = Boolean(onClick);

  const handleKeyDown = (event) => {
    if (!isClickable) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={
        isClickable
          ? 'cursor-pointer transition-colors hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40'
          : ''
      }
    >
      <h3 className="font-semibold text-lg">{service.nome}</h3>
      <p className="text-zinc-400">R$ {service.preco}</p>
      <p className="text-zinc-400">{service.duracao} min</p>
    </Card>
  );
};

export default ServiceCard;
