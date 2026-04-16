import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyAppointments, useCancelAppointment } from "../../../hooks/useApi";
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import MobileNav from "../../../components/layout/MobileNav";
import Card from "../../../components/ui/Card";
import Skeleton from "../../../components/ui/Skeleton";
import Button from "../../../components/ui/Button";

const parseBrazilianDateTime = (dateTimeString) => {
  if (!dateTimeString) return null;

  const [datePart, timePart] = dateTimeString.split(" ");
  if (!datePart || !timePart) return null;

  const [day, month, year] = datePart.split("/");
  const [hour, minute] = timePart.split(":");

  return new Date(year, month - 1, day, hour, minute);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: appointments = [], isLoading } = useMyAppointments();
  const cancelAppointmentMutation = useCancelAppointment();
  const [selectedCancelId, setSelectedCancelId] = useState(null);

  const now = new Date();

  const nextAppointment = appointments
    ?.filter((appt) => {
      const apptDate = parseBrazilianDateTime(appt.data_hora);
      return apptDate && apptDate > now && appt.status !== "cancelado";
    })
    ?.sort((a, b) => {
      const dateA = parseBrazilianDateTime(a.data_hora);
      const dateB = parseBrazilianDateTime(b.data_hora);
      return dateA - dateB;
    })[0];

  const sortedAppointments = [...appointments].sort((a, b) => {
    const isCanceledA = a.status === "cancelado";
    const isCanceledB = b.status === "cancelado";

    if (isCanceledA && !isCanceledB) return 1;
    if (!isCanceledA && isCanceledB) return -1;

    const dateA = parseBrazilianDateTime(a.data_hora);
    const dateB = parseBrazilianDateTime(b.data_hora);

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    return dateA - dateB;
  });

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
                <p>Data: {nextAppointment.data_hora}</p>
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
                      <p>Data: {appt.data_hora}</p>
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
                          disabled={appt.status === 'cancelado' || cancelAppointmentMutation.isPending}
                          loading={selectedCancelId === appt.id && cancelAppointmentMutation.isPending}
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