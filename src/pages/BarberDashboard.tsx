"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { showSuccess, showError } from '@/utils/toast';

// Mock de dados para simular o backend
interface TimeSlot {
  id: string;
  data: string;
  horario: string;
  disponivel: boolean;
}

interface Appointment {
  id: string;
  clienteNome: string;
  data: string;
  horario: string;
  status: 'pendente' | 'confirmado' | 'recusado' | 'cancelado';
}

const BarberDashboard = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBarberData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simular chamada de API para buscar disponibilidade e agendamentos
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay da rede

        const mockTimeSlots: TimeSlot[] = [
          { id: 'ts1', data: '2024-10-26', horario: '09:00', disponivel: true },
          { id: 'ts2', data: '2024-10-26', horario: '10:00', disponivel: false },
          { id: 'ts3', data: '2024-10-27', horario: '14:00', disponivel: true },
        ];
        const mockAppointments: Appointment[] = [
          { id: 'app1', clienteNome: 'Maria Silva', data: '2024-10-26', horario: '10:00', status: 'pendente' },
          { id: 'app2', clienteNome: 'Carlos Souza', data: '2024-10-25', horario: '11:00', status: 'confirmado' },
        ];

        setTimeSlots(mockTimeSlots);
        setAppointments(mockAppointments);
        showSuccess("Dados do painel do barbeiro carregados!");
      } catch (err) {
        console.error("Erro ao carregar dados do barbeiro:", err);
        setError("Não foi possível carregar os dados do painel. Tente novamente.");
        showError("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchBarberData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Painel do Barbeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-12 w-1/2 mx-auto mt-6" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-red-500">Erro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-center text-red-700 dark:text-red-300">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full h-12 text-lg">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <Button asChild className="w-full h-12 text-lg">
              <Link to="/barber/editar-perfil">Editar Perfil</Link>
            </Button>
            <Button asChild className="w-full h-12 text-lg">
              <Link to="/barber/disponibilidade">Minha Disponibilidade</Link>
            </Button>
            <Button asChild className="w-full h-12 text-lg">
              <Link to="/barber/agendamentos">Ver Agendamentos</Link>
            </Button>
            <Button className="w-full h-12 text-lg" disabled>Revisar Solicitações (em breve)</Button>
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold text-center">Seus Horários Cadastrados</h2>
            {timeSlots.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {timeSlots.map(slot => (
                  <li key={slot.id}>{slot.data} às {slot.horario} - {slot.disponivel ? 'Disponível' : 'Ocupado'}</li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">Nenhum horário cadastrado ainda.</p>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold text-center">Seus Próximos Agendamentos</h2>
            {appointments.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {appointments.map(app => (
                  <li key={app.id}>
                    {app.clienteNome} em {app.data} às {app.horario} - Status: {app.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">Nenhum agendamento futuro.</p>
            )}
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