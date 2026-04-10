import Card from '../../../components/ui/Card';

const ServiceCard = ({ service }) => {
  return (
    <Card>
      <h3 className="font-semibold text-lg">{service.nome}</h3>
      <p className="text-zinc-400">R$ {service.preco}</p>
      <p className="text-zinc-400">{service.duracao} min</p>
    </Card>
  );
};

export default ServiceCard;