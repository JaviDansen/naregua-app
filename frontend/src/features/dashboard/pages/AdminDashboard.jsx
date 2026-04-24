import { Link } from 'react-router-dom';
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

  const upcomingToday = appointmentsToday
    .filter((appt) => new Date(appt.data_hora) >= new Date())
    .sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora))
    .slice(0, 5);

  const pendingConfirmation = appointments.filter(
    (appt) => appt.status === 'pendente de confirmação'
  );

  const completedToday = appointmentsToday.filter(
    (appt) => appt.status === 'concluído' || appt.status === 'concluido'
  );

  const noShowToday = appointmentsToday.filter(
    (appt) => appt.status === 'faltou'
  );

  const canceledToday = appointmentsToday.filter(
    (appt) => appt.status === 'cancelado'
  );

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weeklyAppointments = appointments.filter(
    (appt) => new Date(appt.data_hora) >= sevenDaysAgo
  );

  const weeklyCompleted = weeklyAppointments.filter(
    (appt) =>
      appt.status === 'concluído' || appt.status === 'concluido'
  );

  const weeklyNoShow = weeklyAppointments.filter(
    (appt) => appt.status === 'faltou'
  );

  const weeklyCanceled = weeklyAppointments.filter(
    (appt) => appt.status === 'cancelado'
  );

  const attendanceBase =
    weeklyCompleted.length +
    weeklyNoShow.length +
    weeklyCanceled.length;

  const attendanceRate =
    attendanceBase > 0
      ? Math.round((weeklyCompleted.length / attendanceBase) * 100)
      : 0;

  const weekLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const weeklyChart = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));

    const dateString = day.toISOString().split('T')[0];

    const total = weeklyCompleted.filter((appt) =>
      appt.data_hora?.startsWith(dateString)
    ).length;

    return {
      label: weekLabels[day.getDay()],
      total,
    };
  });

  const dashboardCards = [
    {
      title: 'Agendados hoje',
      value: appointmentsToday.length,
      icon: '📅',
      border: 'border-blue-500/40',
    },
    {
      title: 'Pendentes confirmação',
      value: pendingConfirmation.length,
      icon: '🟡',
      border: 'border-yellow-500/40',
    },
    {
      title: 'Concluídos hoje',
      value: completedToday.length,
      icon: '✅',
      border: 'border-green-500/40',
    },
    {
      title: 'Faltas hoje',
      value: noShowToday.length,
      icon: '⚠️',
      border: 'border-red-500/40',
    },
    {
      title: 'Cancelados hoje',
      value: canceledToday.length,
      icon: '🚫',
      border: 'border-zinc-500/40',
    },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 pb-20 md:pb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
            <p className="text-zinc-400 mt-1">
              Visão geral dos agendamentos e operação da barbearia.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-28" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {dashboardCards.map((item) => (
                <Card key={item.title} className={`border ${item.border}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-zinc-400 text-sm">{item.title}</p>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <p className="text-3xl font-bold">{item.value}</p>
                </Card>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <h2 className="text-lg font-semibold mb-4">Atalhos rápidos</h2>

              <div className="grid grid-cols-1 gap-3">
                <Link
                  to="/appointments/new"
                  className="bg-[#003366] hover:bg-blue-900 transition rounded-lg p-3 text-center font-medium"
                >
                  Novo Agendamento
                </Link>

                <Link
                  to="/appointments/manage"
                  className="bg-zinc-800 hover:bg-zinc-700 transition rounded-lg p-3 text-center font-medium"
                >
                  Gerenciar Agendamentos
                </Link>

                <Link
                  to="/services"
                  className="bg-zinc-800 hover:bg-zinc-700 transition rounded-lg p-3 text-center font-medium"
                >
                  Gerenciar Serviços
                </Link>

                <Link
                  to="/employees"
                  className="bg-zinc-800 hover:bg-zinc-700 transition rounded-lg p-3 text-center font-medium"
                >
                  Gerenciar Funcionários
                </Link>
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Alertas prioritários</h2>

              {pendingConfirmation.length === 0 &&
              noShowToday.length === 0 &&
              canceledToday.length === 0 ? (
                <p className="text-zinc-400">
                  Nenhum alerta crítico no momento. A operação está tranquila.
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingConfirmation.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                      <p className="text-yellow-300 font-medium">
                        {pendingConfirmation.length} agendamento(s) pendente(s) de confirmação.
                      </p>
                    </div>
                  )}

                  {noShowToday.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-300 font-medium">
                        {noShowToday.length} falta(s) registrada(s) hoje.
                      </p>
                    </div>
                  )}

                  {canceledToday.length > 0 && (
                    <div className="bg-zinc-500/10 border border-zinc-500/30 rounded-lg p-3">
                      <p className="text-zinc-300 font-medium">
                        {canceledToday.length} agendamento(s) cancelado(s) hoje.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <h2 className="text-lg font-semibold mb-4">Resumo semanal</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-zinc-400 text-sm">
                    Taxa de comparecimento
                  </p>
                  <p className="text-4xl font-bold text-green-400">
                    {attendanceRate}%
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-zinc-800 rounded-lg p-3">
                    <p className="text-sm text-zinc-400">Concluídos</p>
                    <p className="text-xl font-bold">
                      {weeklyCompleted.length}
                    </p>
                  </div>

                  <div className="bg-zinc-800 rounded-lg p-3">
                    <p className="text-sm text-zinc-400">Faltas</p>
                    <p className="text-xl font-bold text-red-400">
                      {weeklyNoShow.length}
                    </p>
                  </div>

                  <div className="bg-zinc-800 rounded-lg p-3">
                    <p className="text-sm text-zinc-400">Cancelados</p>
                    <p className="text-xl font-bold text-zinc-300">
                      {weeklyCanceled.length}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold mb-4">
                Concluídos últimos 7 dias
              </h2>

              <div className="space-y-3">
                {weeklyChart.map((day) => (
                  <div key={day.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{day.label}</span>
                      <span>{day.total}</span>
                    </div>

                    <div className="w-full bg-zinc-800 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{
                          width: `${Math.max(day.total * 15, day.total ? 12 : 0)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Próximos horários de hoje</h2>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : upcomingToday.length > 0 ? (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400">
                        <th className="py-3 px-2">Horário</th>
                        <th className="py-3 px-2">Cliente</th>
                        <th className="py-3 px-2">Serviço</th>
                        <th className="py-3 px-2">Funcionário</th>
                        <th className="py-3 px-2">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {upcomingToday.map((appt) => (
                        <tr key={appt.id} className="border-b border-zinc-900">
                          <td className="py-3 px-2">{formatDateTime(appt.data_hora)}</td>
                          <td className="py-3 px-2">
                            {appt.cliente || appt.usuario || 'Não informado'}
                          </td>
                          <td className="py-3 px-2">{appt.servico}</td>
                          <td className="py-3 px-2">{appt.funcionario}</td>
                          <td className="py-3 px-2">{appt.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <Card>
                <p className="text-zinc-300 font-medium">
                  Nenhum próximo horário para hoje.
                </p>
                <p className="text-zinc-500 text-sm mt-1">
                  Quando houver agendamentos futuros no dia, eles aparecerão aqui.
                </p>
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