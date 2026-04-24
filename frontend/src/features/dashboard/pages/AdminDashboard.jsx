import { useAppointments } from '../../../hooks/useApi';
import Sidebar from '../../../components/layout/Sidebar';
import Navbar from '../../../components/layout/Navbar';
import MobileNav from '../../../components/layout/MobileNav';
import Card from '../../../components/ui/Card';
import Skeleton from '../../../components/ui/Skeleton';
import { formatDateTime } from '../../../utils/formatDate';

const AdminDashboard = () => {
  const { data: appointments = [], isLoading } = useAppointments();

  const today = new Date().toISOString().split('T')[0];

  const appointmentsToday = appointments.filter((appt) =>
    appt.data_hora?.startsWith(today)
  );

  const pendingConfirmation = appointments.filter(
    (appt) => appt.status === 'pendente de confirmação'
  );

  const completedToday = appointmentsToday.filter(
    (appt) => appt.status === 'concluído'
  );

  const noShowToday = appointmentsToday.filter(
    (appt) => appt.status === 'faltou'
  );

  const canceledToday = appointmentsToday.filter(
    (appt) => appt.status === 'cancelado'
  );

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 pb-20 md:pb-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard Administrativo</h1>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <Card>
                <p className="text-zinc-400 text-sm">Agendados hoje</p>
                <p className="text-3xl font-bold">{appointmentsToday.length}</p>
              </Card>

              <Card>
                <p className="text-zinc-400 text-sm">Pendentes confirmação</p>
                <p className="text-3xl font-bold">{pendingConfirmation.length}</p>
              </Card>

              <Card>
                <p className="text-zinc-400 text-sm">Concluídos hoje</p>
                <p className="text-3xl font-bold">{completedToday.length}</p>
              </Card>

              <Card>
                <p className="text-zinc-400 text-sm">Faltas hoje</p>
                <p className="text-3xl font-bold">{noShowToday.length}</p>
              </Card>

              <Card>
                <p className="text-zinc-400 text-sm">Cancelados hoje</p>
                <p className="text-3xl font-bold">{canceledToday.length}</p>
              </Card>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4">Agendamentos de hoje</h2>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : appointmentsToday.length > 0 ? (
              <div className="space-y-4">
                {appointmentsToday.map((appt) => (
                  <Card key={appt.id}>
                    <p>Cliente: {appt.cliente || appt.usuario || 'Não informado'}</p>
                    <p>Serviço: {appt.servico}</p>
                    <p>Funcionário: {appt.funcionario}</p>
                    <p>Data: {formatDateTime(appt.data_hora)}</p>
                    <p>Status: {appt.status}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <p className="text-zinc-400">Nenhum agendamento para hoje</p>
              </Card>
            )}
          </div>
        </div>

        <MobileNav />
      </div>
    </div>
  );
};

export default AdminDashboard;