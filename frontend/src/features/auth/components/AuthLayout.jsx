const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block">
          <h1 className="text-4xl font-bold mb-4">NaRegua</h1>

          <p className="text-xl text-zinc-300 mb-4">
            Sistema de agendamento para barbearias.
          </p>

          <p className="text-zinc-500 leading-relaxed max-w-md">
            Organize horários, acompanhe agendamentos, gerencie serviços e
            funcionários em uma plataforma simples e eficiente.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-sm text-zinc-400 mt-2">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;