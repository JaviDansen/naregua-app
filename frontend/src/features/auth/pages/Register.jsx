import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [telefone, setTelefone] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const formatTelefone = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 2) {
      return numbers;
    }

    if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }

    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }

    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setError('As senhas informadas não coincidem.');
      return;
    }

    const telefoneNumeros = telefone.replace(/\D/g, "");

    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
      setError("Informe um telefone válido com DDD.");
      return;
    }

    setLoading(true);
    setError('');

    const result = await register(nome, email, senha, telefone);

    setLoading(false);

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
  };

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Cadastre-se para agendar seus horários de forma rápida."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <Input
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(formatTelefone(e.target.value))}
          placeholder="(98) 99999-9999"
          required
        />

        <Input
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <Input
          label="Confirmar senha"
          type="password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Cadastrando..." : "Criar conta"}
        </Button>
      </form>

      <p className="text-sm mt-6 text-center text-zinc-400">
        Já tem conta?{" "}
        <Link to="/login" className="text-blue-400 hover:text-blue-300">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;