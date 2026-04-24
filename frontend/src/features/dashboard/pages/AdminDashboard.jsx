import { Link } from 'react-router-dom';
import { useAppointments } from '../../../hooks/useApi';
import Sidebar from '../../../components/layout/Sidebar';
import Navbar from '../../../components/layout/Navbar';
import MobileNav from '../../../components/layout/MobileNav';
import Card from '../../../components/ui/Card';
import Skeleton from '../../../components/ui/Skeleton';

const AdminDashboard = () => {
  const { data: appointments = [], isLoading } = useAppointments();

  const now = new Date();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const activeStatuses = ['agendado', 'pendente de confirmação'];

  const weeklyAppointments = appointments.filter(
    (appt) => new Date(appt.data_hora) >= sevenDaysAgo
  );

  const weeklyCompleted = weeklyAppointments.filter(
    (appt) => appt.status === 'concluido' || appt.status === 'concluído'
  );

  const weeklyNoShow = weeklyAppointments.filter(
    (appt) => appt.status === 'faltou'
  );

  const weeklyCanceled = weeklyAppointments.filter(
    (appt) => appt.status === 'cancelado'
  );

  const futureAppointments = appointments.filter(
    (appt) =>
      activeStatuses.includes(appt.status) &&
      new Date(appt.data_hora) >= now
  );

  const pendingConfirmation = appointments.filter(
    (appt) => appt.status === 'pendente de confirmação'
  );

  const attendanceBase =
    weeklyCompleted.length + weeklyNoShow.length + weeklyCanceled.length;

  const attendanceRate =
    attendanceBase > 0
      ? Math.round((weeklyCompleted.length / attendanceBase) * 100)
      : 0;

  const getMostFrequent = (items, field) => {
    const counter = items.reduce((acc, item) => {
      const value = item[field];

      if (!value) return acc;

      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});

    const sorted = Object.entries(counter).sort((a, b) => b[1] - a[1]);

    return sorted.length > 0
      ? { name: sorted[0][0], total: sorted[0][1] }
      : { name: 'Sem dados', total: 0 };
  };

  const mostBookedService = getMostFrequent(appointments, 'servico');
  const mostRequestedEmployee = getMostFrequent(appointments, 'funcionario');

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

  const maxChartValue = Math.max(...weeklyChart.map((day) => day.total), 1);

  const strategicCards = [
    {
      title: 'Atendimentos na semana',
      value: weeklyCompleted.length,
      description: 'Agendamentos concluídos',
      border: 'border-green-500/40',
      text: 'text-green-300',
    },
    {
      title: 'Comparecimento',
      value: `${attendanceRate}%`,
      description: 'Baseado na semana',
      border: 'border-blue-500/40',
      text: 'text-blue-300',
    },
    {
      title: 'Faltas na semana',
      value: weeklyNoShow.length,
      description: 'Clientes que não compareceram',
      border: 'border-red-500/40',
      text: 'text-red-300',
    },
    {
      title: 'Cancelamentos',
      value: weeklyCanceled.length,
      description: 'Cancelados nos últimos 7 dias',
      border: 'border-zinc-500/40',
      text: 'text-zinc-300',
    },
    {
      title: 'Agendamentos futuros',
      value: futureAppointments.length,
      description: 'Ainda ativos na agenda',
      border: 'border-yellow-500/40',
      text: 'text-yellow-300',
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
              Visão gerencial da barbearia com indicadores de desempenho.
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
              {strategicCards.map((item) => (
                <Card key={item.title} className={`border ${item.border}`}>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                  <p className={`text-3xl font-bold mt-3 ${item.text}`}>
                    {item.value}
                  </p>
                  <p className="text-zinc-500 text-xs mt-2">
                    {item.description}
                  </p>
                </Card>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <h2 className="text-lg font-semibold mb-4">Atalhos rápidos</h2>

              <div className="grid grid-cols-1 gap-3">
                <Link
                  to="/appointments/manage"
                  className="bg-[#003366] hover:bg-blue-900 transition rounded-lg p-3 text-center font-medium"
                >
                  Gerenciar Agendamentos
                </Link>

                <Link
                  to="/appointments/new"
                  className="bg-zinc-800 hover:bg-zinc-700 transition rounded-lg p-3 text-center font-medium"
                >
                  Novo Agendamento
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
              <h2 className="text-lg font-semibold mb-4">Alertas gerenciais</h2>

              {pendingConfirmation.length === 0 &&
              weeklyNoShow.length === 0 &&
              weeklyCanceled.length === 0 ? (
                <p className="text-zinc-400">
                  Nenhum alerta relevante no momento. Os indicadores estão
                  estáveis.
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingConfirmation.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                      <p className="text-yellow-300 font-medium">
                        {pendingConfirmation.length} agendamento(s) ainda
                        pendente(s) de confirmação.
                      </p>
                    </div>
                  )}

                  {weeklyNoShow.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-300 font-medium">
                        {weeklyNoShow.length} falta(s) registrada(s) nos últimos
                        7 dias.
                      </p>
                    </div>
                  )}

                  {weeklyCanceled.length > 0 && (
                    <div className="bg-zinc-500/10 border border-zinc-500/30 rounded-lg p-3">
                      <p className="text-zinc-300 font-medium">
                        {weeklyCanceled.length} cancelamento(s) nos últimos 7
                        dias.
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
                          width: `${(day.total / maxChartValue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <h2 className="text-lg font-semibold mb-4">
                Serviço mais agendado
              </h2>

              <p className="text-2xl font-bold">
                {mostBookedService.name}
              </p>

              <p className="text-zinc-400 text-sm mt-2">
                {mostBookedService.total} agendamento(s) registrados.
              </p>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold mb-4">
                Funcionário mais requisitado
              </h2>

              <p className="text-2xl font-bold">
                {mostRequestedEmployee.name}
              </p>

              <p className="text-zinc-400 text-sm mt-2">
                {mostRequestedEmployee.total} agendamento(s) vinculados.
              </p>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold mb-4">
                Pendências administrativas
              </h2>

              <p className="text-2xl font-bold text-yellow-300">
                {pendingConfirmation.length}
              </p>

              <p className="text-zinc-400 text-sm mt-2">
                Agendamento(s) aguardando confirmação.
              </p>

              <Link
                to="/appointments/manage"
                className="inline-block mt-4 text-sm text-blue-300 hover:text-blue-200"
              >
                Ver gerenciamento
              </Link>
            </Card>
          </div>
        </div>

        <MobileNav />
      </div>
    </div>
  );
};

export default AdminDashboard;