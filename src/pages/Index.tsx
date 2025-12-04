"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-600 dark:text-gray-400">Carregando aplicação...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    switch (userRole) {
      case 'admin':
        return <Link to="/admin" replace />;
      case 'barber':
        return <Link to="/barber" replace />;
      case 'client':
        return <Link to="/client" replace />;
      default:
        return <Link to="/client" replace />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Bem-vindo ao Agendador de Barbearia
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Sua solução completa para gerenciar agendamentos de barbearia.
          Clientes podem agendar, barbeiros podem gerenciar suas agendas e administradores têm controle total.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button asChild size="lg" className="text-lg px-8 py-4">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg px-8 py-4">
            <Link to="/register">Registrar</Link>
          </Button>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;