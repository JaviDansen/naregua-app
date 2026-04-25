import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyAppointments, useCancelAppointment } from '../../../hooks/useApi';
import Sidebar from '../../../components/layout/Sidebar';
import Navbar from '../../../components/layout/Navbar';
import MobileNav from '../../../components/layout/MobileNav';
import Card from '../../../components/ui/Card';
import Skeleton from '../../../components/ui/Skeleton';
import Button from '../../../components/ui/Button';
import {
  formatDateTime,
  getNextAppointment,
  sortAppointmentsWithCanceledLast,
} from '../../../utils/formatDate';
import { useAuth } from '../../auth/hooks/useAuth';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.perfil === 'admin';

  if (isAdmin) {
    return <AdminDashboard />;
  }

  const navigate = useNavigate();
  const { data: appointments = [], isLoading } = useMyAppointments();
  const cancelAppointmentMutation = useCancelAppointment();
  const [selectedCancelId, setSelectedCancelId] = useState(null);

  const nextAppointment = getNextAppointment(appointments || []);
  const sortedAppointments = sortAppointmentsWithCanceledLast(appointments || []);

  const handleCancel = async (id) => {
    setSelectedCancelId(id);

    try {
      await cancelAppointmentMutation.mutateAsync(id);
    } finally {
      setSelectedCancelId(null);
    }
  };

  const renderStatusBadge = (status) => {
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
      <span
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
          statusClasses[status] ||
          'bg-zinc-500/10 text-zinc-300 border-zinc-500/30'
        }`}
      >
        {status}
      </span>
    );
  };

  const canEditOrCancel = (status) =>
    status !== 'cancelado' && status !== 'concluido' && status !== 'concluído';

  const renderAppointmentCard = (appt, highlight = false) => (
    <Card
      key={appt.id}
      className={
        highlight
          ? 'border border-blue-500/40 bg-blue-500/5'
          : 'border border-zinc-800'
      }
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{appt.servico}</h3>
            {renderStatusBadge(appt.status)}
          </div>

          <p className="text-zinc-300">
            {formatDateTime(appt.data_hora)}
          </p>

          <p className="text-sm text-zinc-500 mt-1">
            Funcionário: {appt.funcionario}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <Button
            variant="secondary"
            className="px-4 py-2 text-sm"
            onClick={() => navigate(`/appointments/${appt.id}/edit`)}
            disabled={!canEditOrCancel(appt.status)}
          >
            Editar
          </Button>

          <Button
            variant="danger"
            className="px-4 py-2 text-sm"
            onClick={() => handleCancel(appt.id)}
            disabled={
              !canEditOrCancel(appt.status) ||
              cancelAppointmentMutation.isPending
            }
            loading={
              selectedCancelId === appt.id &&
              cancelAppointmentMutation.isPending
            }
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 pb-20 md:pb-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              Olá, {user?.nome || 'cliente'}
            </h1>
            <p className="text-zinc-400 mt-1">
              Acompanhe seus horários e gerencie seus agendamentos.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Próximo agendamento
            </h2>

            {isLoading ? (
              <Skeleton className="h-32" />
            ) : nextAppointment ? (
              renderAppointmentCard(nextAppointment, true)
            ) : (
              <Card className="border border-zinc-800">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-zinc-300 font-medium">
                      Você ainda não possui um próximo agendamento.
                    </p>
                    <p className="text-zinc-500 text-sm mt-1">
                      Agende um horário para cuidar do seu visual.
                    </p>
                  </div>

                  <Button onClick={() => navigate('/appointments/new')}>
                    Novo agendamento
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Meus agendamentos
            </h2>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
            ) : sortedAppointments.length > 0 ? (
              <div className="space-y-4">
                {sortedAppointments.map((appt) =>
                  renderAppointmentCard(appt)
                )}
              </div>
            ) : (
              <Card className="border border-zinc-800">
                <div className="text-center py-6">
                  <p className="text-zinc-300 font-medium">
                    Nenhum agendamento encontrado.
                  </p>

                  <p className="text-zinc-500 text-sm mt-1 mb-4">
                    Quando você criar um agendamento, ele aparecerá aqui.
                  </p>

                  <Button onClick={() => navigate('/appointments/new')}>
                    Criar primeiro agendamento
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        <MobileNav />
      </div>
    </div>
  );
};

export default Dashboard;