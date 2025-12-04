"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { showSuccess, showError } from '@/utils/toast';
import { useAuth } from '@/contexts/AuthContext';

// Mock de dados
interface Barber {
  id: string;
  nome: string;
}

interface TimeSlot {
  id: string;
  barberId: string;
  data: string; // YYYY-MM-DD
  horario: string; // HH:MM
  disponivel: boolean;
}

const mockBarbers: Barber[] = [
  { id: 'b1', nome: 'João Barbeiro' },
  { id: 'b2', nome: 'Maria Tesoura' },
  { id: 'b3', nome: 'Pedro Navalha' },
];

const mockTimeSlots: TimeSlot[] = [
  { id: 'ts1', barberId: 'b1', data: '2024-10-26', horario: '09:00', disponivel: true },
  { id: 'ts2', barberId: 'b1', data: '2024-10-26', horario: '10:00', disponivel: false },
  { id: 'ts3', barberId: 'b1', data: '2024-10-26', horario: '11:00', disponivel: true },
  { id: 'ts4', barberId: 'b1', data: '2024-10-27', horario: '14:00', disponivel: true },
  { id: 'ts5', barberId: 'b1', data: '2024-10-27', horario: '15:00', disponivel: true },
];

const AgendarHorario = () => {
  const { barberId, timeSlotId } = useParams<{ barberId: string; timeSlotId: string }>();
  const navigate = useNavigate();
  const { userRole } = useAuth(); // Para simular o cliente logado
  const [barber, setBarber] = useState<Barber | null>(null);
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay

        const foundBarber = mockBarbers.find(b => b.id === barberId);
        const foundTimeSlot = mockTimeSlots.find(ts => ts.id === timeSlotId && ts.barberId === barberId);

        if (foundBarber && foundTimeSlot && foundTimeSlot.disponivel) {
          setBarber(foundBarber);
          setTimeSlot(foundTimeSlot);
          showSuccess("Detalhes do agendamento carregados!");
        } else {
          setError("Detalhes do agendamento não encontrados ou horário indisponível.");
          showError("Erro ao carregar agendamento.");
        }
      } catch (err) {
        console.error("Erro ao carregar dados para agendamento:", err);
        setError("Não foi possível carregar os detalhes para agendamento.");
        showError("Erro ao carregar detalhes.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [barberId, timeSlotId]);

  const handleConfirmAppointment = async () => {
    if (!barber || !timeSlot) {
      showError("Dados do agendamento incompletos.");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula API de agendamento
      // Aqui você faria a chamada real para o Supabase para criar o agendamento
      // e atualizar a disponibilidade do horário.

      showSuccess(`Agendamento confirmado com ${barber.nome} para ${timeSlot.data} às ${timeSlot.horario}!`);
      navigate('/meus-agendamentos'); // Redireciona para a página de meus agendamentos
    } catch (err) {
      console.error("Erro ao confirmar agendamento:", err);
      showError("Não foi possível confirmar o agendamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-red-500">Erro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-center text-red-700 dark:text-red-300">{error}</p>
            <Button asChild className="w-full h-12 text-lg">
              <Link to={`/barbeiro/${barberId}`}>Voltar ao Perfil do Barbeiro</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!barber || !timeSlot) {
    return null; // Should not happen if error is handled
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Confirmar Agendamento</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Revise os detalhes e confirme seu horário.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg space-y-2">
            <p><strong>Barbeiro:</strong> {barber.nome}</p>
            <p><strong>Data:</strong> {timeSlot.data}</p>
            <p><strong>Horário:</strong> {timeSlot.horario}</p>
            <p><strong>Seu Perfil:</strong> {userRole === 'client' ? 'Cliente' : 'Desconhecido'}</p>
          </div>
          <Button onClick={handleConfirmAppointment} className="w-full h-12 text-lg" disabled={loading}>
            {loading ? 'Confirmando...' : 'Confirmar Agendamento'}
          </Button>
          <Button asChild variant="outline" className="w-full h-12 text-lg">
            <Link to={`/barbeiro/${barberId}`}>Voltar</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgendarHorario;