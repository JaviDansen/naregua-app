import Card from '../../../components/ui/Card';
import { formatDate, formatTime } from '../../../utils/formatDate';

const AppointmentCard = ({ appointment }) => {
  return (
    <Card>
      <h3 className="font-semibold">{appointment.servico_nome}</h3>
      <p className="text-zinc-400">Funcionário: {appointment.funcionario_nome}</p>
      <p className="text-zinc-400">Data: {formatDate(appointment.data_hora)}</p>
      <p className="text-zinc-400">Hora: {formatTime(appointment.data_hora)}</p>
      <p className="text-zinc-400">Status: {appointment.status}</p>
    </Card>
  );
};

export default AppointmentCard;