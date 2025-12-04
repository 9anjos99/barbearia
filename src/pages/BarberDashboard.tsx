"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BarberDashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Painel do Barbeiro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-center text-gray-700 dark:text-gray-300">
            Bem-vindo, Barbeiro! Gerencie seu perfil, disponibilidade e agendamentos aqui.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="w-full h-12 text-lg">Editar Perfil</Button>
            <Button className="w-full h-12 text-lg">Definir Disponibilidade</Button>
            <Button className="w-full h-12 text-lg">Ver Agendamentos</Button>
            <Button className="w-full h-12 text-lg">Revisar Solicitações</Button>
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

export default BarberDashboard;