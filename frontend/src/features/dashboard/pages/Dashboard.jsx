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

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 pb-20 md:pb-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Próximo Agendamento</h2>

            {isLoading ? (
              <Skeleton className="h-24" />
            ) : nextAppointment ? (
              <Card>
                <p>Serviço: {nextAppointment.servico}</p>
                <p>Data: {formatDateTime(nextAppointment.data_hora)}</p>
                <p>Funcionário: {nextAppointment.funcionario}</p>
                <p>Status: {nextAppointment.status}</p>
              </Card>
            ) : (
              <Card>
                <p className="text-zinc-400">Nenhum próximo agendamento encontrado</p>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Meus Agendamentos</h2>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : sortedAppointments.length > 0 ? (
              <div className="space-y-4">
                {sortedAppointments.map((appt) => (
                  <Card key={appt.id}>
                    <div className="flex flex-col gap-2">
                      <p>Serviço: {appt.servico}</p>
                      <p>Data: {formatDateTime(appt.data_hora)}</p>
                      <p>Funcionário: {appt.funcionario}</p>
                      <p>Status: {appt.status}</p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <Button
                          variant="secondary"
                          onClick={() => navigate(`/appointments/${appt.id}/edit`)}
                          disabled={appt.status === 'cancelado'}
                        >
                          Editar
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => handleCancel(appt.id)}
                          disabled={
                            appt.status === 'cancelado' ||
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
                ))}
              </div>
            ) : (
              <Card>
                <p className="text-zinc-400">Nenhum agendamento encontrado</p>
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