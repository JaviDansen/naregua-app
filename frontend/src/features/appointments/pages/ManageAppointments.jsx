import {
  useAppointments,
  useCancelAppointment,
  useCompleteAppointment,
  useNoShowAppointment,
} from '../../../hooks/useApi';
import Sidebar from '../../../components/layout/Sidebar';
import Navbar from '../../../components/layout/Navbar';
import MobileNav from '../../../components/layout/MobileNav';
import Card from '../../../components/ui/Card';
import Skeleton from '../../../components/ui/Skeleton';
import Button from '../../../components/ui/Button';
import { formatDateTime } from '../../../utils/formatDate';

const ManageAppointments = () => {
  const { data: appointments = [], isLoading } = useAppointments();

  const completeMutation = useCompleteAppointment();
  const noShowMutation = useNoShowAppointment();
  const cancelMutation = useCancelAppointment();

  const activeStatuses = ['agendado', 'pendente de confirmação'];

  const isActiveAppointment = (status) => activeStatuses.includes(status);

  const activeAppointments = appointments
    .filter((appt) => isActiveAppointment(appt.status))
    .sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));

  const historyAppointments = appointments
    .filter((appt) => !isActiveAppointment(appt.status))
    .sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));

  const handleComplete = async (id) => {
    await completeMutation.mutateAsync(id);
  };

  const handleNoShow = async (id) => {
    await noShowMutation.mutateAsync(id);
  };

  const handleCancel = async (id) => {
    await cancelMutation.mutateAsync(id);
  };

  const getStatusClasses = (status) => {
    const statusClasses = {
      agendado: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      'pendente de confirmação':
        'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
      concluido: 'bg-green-500/10 text-green-300 border-green-500/30',
      concluído: 'bg-green-500/10 text-green-300 border-green-500/30',
      faltou: 'bg-red-500/10 text-red-300 border-red-500/30',
      cancelado: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30',
    };

    return (
      statusClasses[status] ||
      'bg-zinc-500/10 text-zinc-300 border-zinc-500/30'
    );
  };

  const renderStatusBadge = (status) => (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
        status
      )}`}
    >
      {status}
    </span>
  );

  const renderAppointmentTable = (items, showActions = false) => (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400">
              <th className="py-3 px-2">Cliente</th>
              <th className="py-3 px-2">Serviço</th>
              <th className="py-3 px-2">Funcionário</th>
              <th className="py-3 px-2">Data/Hora</th>
              <th className="py-3 px-2">Status</th>
              {showActions && <th className="py-3 px-2">Ações</th>}
            </tr>
          </thead>

          <tbody>
            {items.map((appt) => (
              <tr key={appt.id} className="border-b border-zinc-900">
                <td className="py-3 px-2">
                  {appt.cliente || appt.usuario || 'Não informado'}
                </td>

                <td className="py-3 px-2">{appt.servico}</td>

                <td className="py-3 px-2">{appt.funcionario}</td>

                <td className="py-3 px-2">
                  {formatDateTime(appt.data_hora)}
                </td>

                <td className="py-3 px-2">{renderStatusBadge(appt.status)}</td>

                {showActions && (
                  <td className="py-3 px-2">
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700"
                        loading={
                          completeMutation.isPending &&
                          completeMutation.variables === appt.id
                        }
                        onClick={() => handleComplete(appt.id)}
                      >
                        Concluir
                      </Button>

                      <Button
                        className="text-xs px-3 py-1 bg-yellow-600 hover:bg-yellow-700"
                        loading={
                          noShowMutation.isPending &&
                          noShowMutation.variables === appt.id
                        }
                        onClick={() => handleNoShow(appt.id)}
                      >
                        Faltou
                      </Button>

                      <Button
                        className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700"
                        loading={
                          cancelMutation.isPending &&
                          cancelMutation.variables === appt.id
                        }
                        onClick={() => handleCancel(appt.id)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 pb-20 md:pb-6">
          <h1 className="text-2xl font-bold mb-2">
            Gerenciar Agendamentos
          </h1>

          <p className="text-zinc-400 mb-6">
            Visualize, acompanhe e atualize os status dos agendamentos da
            barbearia.
          </p>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-8">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Agendamentos ativos
                    </h2>
                    <p className="text-zinc-500 text-sm">
                      Agendamentos que ainda exigem acompanhamento do
                      administrador.
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 px-3 py-1 text-sm">
                    {activeAppointments.length} ativo(s)
                  </span>
                </div>

                {activeAppointments.length > 0 ? (
                  renderAppointmentTable(activeAppointments, true)
                ) : (
                  <Card>
                    <p className="text-zinc-300 font-medium">
                      Nenhum agendamento ativo no momento.
                    </p>
                    <p className="text-zinc-500 text-sm mt-1">
                      Quando houver agendamentos pendentes ou agendados, eles
                      aparecerão aqui.
                    </p>
                  </Card>
                )}
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">Histórico</h2>
                    <p className="text-zinc-500 text-sm">
                      Agendamentos concluídos, faltas e cancelamentos.
                    </p>
                  </div>

                  <span className="rounded-full bg-zinc-500/10 border border-zinc-500/30 text-zinc-300 px-3 py-1 text-sm">
                    {historyAppointments.length} registro(s)
                  </span>
                </div>

                {historyAppointments.length > 0 ? (
                  renderAppointmentTable(historyAppointments, false)
                ) : (
                  <Card>
                    <p className="text-zinc-300 font-medium">
                      Nenhum histórico encontrado.
                    </p>
                    <p className="text-zinc-500 text-sm mt-1">
                      Agendamentos finalizados aparecerão nesta seção.
                    </p>
                  </Card>
                )}
              </section>
            </div>
          ) : (
            <Card>
              <p className="text-zinc-300 font-medium">
                Nenhum agendamento encontrado.
              </p>

              <p className="text-zinc-500 text-sm mt-1">
                Quando houver agendamentos cadastrados, eles aparecerão aqui.
              </p>
            </Card>
          )}
        </div>

        <MobileNav />
      </div>
    </div>
  );
};

export default ManageAppointments;