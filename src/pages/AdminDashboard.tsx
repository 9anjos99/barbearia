"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Painel do Administrador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-center text-gray-700 dark:text-gray-300">
            Bem-vindo, Administrador! Aqui você gerenciará barbeiros, usuários, agendas e agendamentos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild className="w-full h-12 text-lg">
              <Link to="/admin/gerenciar-barbeiros">Gerenciar Barbeiros</Link>
            </Button>
            <Button asChild className="w-full h-12 text-lg">
              <Link to="/admin/gerenciar-usuarios">Gerenciar Usuários</Link>
            </Button>
            <Button asChild className="w-full h-12 text-lg">
              <Link to="/admin/ver-todas-agendas">Ver Todas as Agendas</Link>
            </Button>
            {/* Adicionar botão para gerenciar agendamentos se for uma tela separada */}
            <Button className="w-full h-12 text-lg" disabled>Gerenciar Agendamentos (em breve)</Button>
          </div>
          <div className="flex justify-center">
            <Button onClick={logout} variant="destructive" className="mt-6 w-1/2 h-12 text-lg">
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;