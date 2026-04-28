import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { formatPhone, isValidPhone } from '../../../utils/phone';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    role: 'customer',
    senha: '',
    confirmarSenha: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!formData.nome.trim()) {
      setError('Informe seu nome completo.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Informe seu email.');
      return;
    }

    const telefoneNumeros = formData.telefone.replace(/\D/g, '');

    if (!isValidPhone(formData.telefone)) {
      setError('Informe um telefone válido com DDD.');
      return;
    }

    if (!formData.senha) {
      setError('Informe uma senha.');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    const result = await register(
      formData.nome.trim(),
      formData.email.trim(),
      formData.senha,
      formData.telefone
    );

    setLoading(false);

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error || 'Erro ao criar conta.');
    }
  };

  const LabelCustom = ({ text }) => (
    <label className="text-zinc-400 text-sm font-medium mb-2 block">
      {text} <span className="text-[#e11d48] ml-1">*</span>
    </label>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-10 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12 items-stretch min-h-[700px]">

        <div className="hidden md:block relative rounded-3xl overflow-hidden shadow-2xl border border-white/5">
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074"
            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[20%]"
            alt="Barbearia"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

          <div className="absolute bottom-16 left-12 right-12 z-10">
            <h1 className="text-6xl font-black italic uppercase text-white tracking-tighter leading-none mb-6">
              Na<span className="text-[#e11d48]">Regua</span>App
            </h1>

            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              {formData.role === 'customer'
                ? 'Sua barbearia, seu estilo, sua gestão.'
                : 'Gestão profissional para o seu negócio.'}
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
              O lugar onde clientes encontram os melhores barbeiros do mercado.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-[#0a0a0a] p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
          <div className="mb-8 text-left">
            <h3 className="text-3xl font-bold text-white mb-2">
              {formData.role === 'customer' ? 'Crie sua conta' : 'Acesso Administrativo'}
            </h3>
            <p className="text-zinc-500 text-sm">
              Informe seus dados para começar.
            </p>
          </div>

          <div className="flex bg-black p-1.5 rounded-2xl mb-10 border border-white/5">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'customer' })}
              className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest transition-all duration-300 ${
                formData.role === 'customer'
                  ? 'bg-[#e11d48] text-white shadow-lg shadow-[#e11d48]/20'
                  : 'text-zinc-600 hover:text-white'
              }`}
            >
              SOU CLIENTE
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'admin' })}
              className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest transition-all duration-300 ${
                formData.role === 'admin'
                  ? 'bg-[#e11d48] text-white shadow-lg shadow-[#e11d48]/20'
                  : 'text-zinc-600 hover:text-white'
              }`}
            >
              SOU BARBEARIA
            </button>
          </div>

          {formData.role === 'customer' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <p className="text-red-500 text-xs text-center font-bold bg-red-500/10 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <div className="text-left">
                <LabelCustom text="Nome Completo" />
                <Input
                  placeholder="Seu nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                  className="bg-zinc-900/30 border-white/5 h-14 w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-left">
                  <LabelCustom text="Telefone" />
                  <Input
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        telefone: formatPhone(e.target.value)
                      })
                    }
                    required
                    className="bg-zinc-900/30 border-white/5 h-14 w-full"
                  />
                </div>

                <div className="text-left">
                  <LabelCustom text="Email" />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="bg-zinc-900/30 border-white/5 h-14 w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-left">
                  <LabelCustom text="Senha" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.senha}
                    onChange={(e) =>
                      setFormData({ ...formData, senha: e.target.value })
                    }
                    required
                    className="bg-zinc-900/30 border-white/5 h-14 w-full"
                  />
                </div>

                <div className="text-left">
                  <LabelCustom text="Confirmar" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmarSenha}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmarSenha: e.target.value
                      })
                    }
                    required
                    className="bg-zinc-900/30 border-white/5 h-14 w-full"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e11d48] hover:bg-[#ff1e56] py-5 rounded-2xl font-black text-white uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#e11d48]/20 hover:shadow-[#e11d48]/40"
              >
                {loading ? 'Processando...' : 'Finalizar Cadastro'}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center py-10">
              <div className="space-y-6 mb-12">
                <p className="text-white text-2xl italic tracking-wide">
                  Processo exclusivo
                </p>

                <p className="text-zinc-500 text-sm max-w-[280px] mx-auto leading-relaxed">
                  O acesso para barbearias é restrito a profissionais cadastrados.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full border-2 border-[#e11d48] text-[#e11d48] py-4 rounded-xl font-black tracking-widest text-sm uppercase transition-all duration-300 hover:bg-[#e11d48] hover:text-white cursor-pointer"
              >
                IR PARA O LOGIN
              </button>
            </div>
          )}

          <p className="mt-10 text-center text-sm text-zinc-600 font-medium">
            Já possui uma conta?
            <span
              onClick={() => navigate('/login')}
              className="text-[#e11d48] hover:text-[#ff1e56] ml-2 transition-colors font-bold cursor-pointer hover:underline underline-offset-4"
            >
              Fazer Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;