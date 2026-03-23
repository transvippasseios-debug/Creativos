import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { firebaseUser, loading } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const from = location.state?.from?.pathname || "/";

  React.useEffect(() => {
    if (firebaseUser && !loading) {
      navigate(from, { replace: true });
    }
  }, [firebaseUser, loading, navigate, from]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      await authService.signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Erro ao entrar com Google");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">CreativeAI</h1>
          <p className="text-slate-500 mt-2">Plataforma de Criativos com IA</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">Boas-vindas</h2>
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            ) : (
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            )}
            Entrar com Google
          </button>

          <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed">
            Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}
