import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await login(email, senha);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-10 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12 items-stretch min-h-[600px]">
        
        {/* LADO ESQUERDO: Branding e Imagem */}
        <div className="hidden md:block relative rounded-3xl overflow-hidden shadow-2xl border border-white/5">
          <img 
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[20%]"
            alt="Barbearia"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          <div className="absolute bottom-16 left-12 right-12 z-10">
            <h1 className="text-6xl font-black italic uppercase text-white tracking-tighter leading-none mb-6">
              NA<span className="text-[#e11d48]">REGUA</span>
            </h1>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Sua barbearia, <br/>em outro nível.
            </h2>
            <div className="w-16 h-1.5 bg-[#e11d48] mb-6"></div>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
              A ferramenta definitiva para barbearias que buscam excelência e agilidade.
            </p>
          </div>
        </div>

        {/* LADO DIREITO: Card de Login */}
        <div className="flex flex-col justify-center bg-[#0a0a0a] p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-white mb-2">Entrar na conta</h3>
            <p className="text-zinc-500 text-sm">Acesse sua área administrativa.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-xs text-center font-bold bg-red-500/10 py-2 rounded-lg">{error}</p>}
            
            <div className="space-y-1">
              <label className="text-zinc-400 text-sm font-medium mb-2 block">
                Email <span className="text-[#e11d48] ml-1">*</span>
              </label>
              <Input placeholder="seu@email.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-zinc-900/30 border-white/5 h-14" />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 text-sm font-medium mb-2 block">
                Senha <span className="text-[#e11d48] ml-1">*</span>
              </label>
              <Input placeholder="••••••••" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required className="bg-zinc-900/30 border-white/5 h-14" />
            </div>
            
            <div className="pt-4">
              <Button type="submit" disabled={loading} className="w-full bg-[#e11d48] hover:bg-[#ff1e56] py-5 rounded-2xl font-black text-white uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#e11d48]/20 hover:shadow-[#e11d48]/40">
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-zinc-600 font-medium">
            Ainda não tem acesso? 
            <span onClick={() => navigate('/register')} className="text-[#e11d48] hover:text-[#ff1e56] ml-2 transition-colors font-bold cursor-pointer hover:underline underline-offset-4">
               Criar conta
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;