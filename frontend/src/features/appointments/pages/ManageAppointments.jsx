import {
  useAppointments,
  useUpdateAppointment,
  useCancelAppointment,
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

  const updateMutation = useUpdateAppointment();
  const cancelMutation = useCancelAppointment();

  const handleStatusUpdate = async (id, status) => {
    await updateMutation.mutateAsync({
      id,
      data: { status },
    });
  };

  const handleCancel = async (id) => {
    await cancelMutation.mutateAsync(id);
  };

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
            Visualize e acompanhe todos os agendamentos da barbearia.
          </p>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : appointments.length > 0 ? (
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
                      <th className="py-3 px-2">Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {appointments.map((appt) => (
                      <tr
                        key={appt.id}
                        className="border-b border-zinc-900"
                      >
                        <td className="py-3 px-2">
                          {appt.cliente ||
                            appt.usuario ||
                            'Não informado'}
                        </td>

                        <td className="py-3 px-2">
                          {appt.servico}
                        </td>

                        <td className="py-3 px-2">
                          {appt.funcionario}
                        </td>

                        <td className="py-3 px-2">
                          {formatDateTime(appt.data_hora)}
                        </td>

                        <td className="py-3 px-2">
                          {appt.status}
                        </td>

                        <td className="py-3 px-2">
                          {appt.status === 'agendado' ||
                          appt.status ===
                            'pendente de confirmação' ? (
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700"
                                onClick={() =>
                                  handleStatusUpdate(
                                    appt.id,
                                    'concluído'
                                  )
                                }
                              >
                                Concluir
                              </Button>

                              <Button
                                className="text-xs px-3 py-1 bg-yellow-600 hover:bg-yellow-700"
                                onClick={() =>
                                  handleStatusUpdate(
                                    appt.id,
                                    'faltou'
                                  )
                                }
                              >
                                Faltou
                              </Button>

                              <Button
                                className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700"
                                onClick={() =>
                                  handleCancel(appt.id)
                                }
                              >
                                Cancelar
                              </Button>
                            </div>
                          ) : (
                            <span className="text-zinc-500">
                              Sem ações
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card>
              <p className="text-zinc-300 font-medium">
                Nenhum agendamento encontrado.
              </p>

              <p className="text-zinc-500 text-sm mt-1">
                Quando houver agendamentos cadastrados,
                eles aparecerão aqui.
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