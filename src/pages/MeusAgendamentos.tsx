"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { showSuccess, showError } from '@/utils/toast';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock de dados
interface Appointment {
  id: string;
  barberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: 'pendente' | 'confirmado' | 'cancelado';
}

const mockAppointments: Appointment[] = [
  { id: 'app1', barberName: 'João Barbeiro', date: '2024-10-26', time: '09:00', status: 'confirmado' },
  { id: 'app2', barberName: 'Maria Tesoura', date: '2024-10-28', time: '13:00', status: 'pendente' },
  { id: 'app3', barberName: 'Pedro Navalha', date: '2024-10-25', time: '10:30', status: 'cancelado' },
];

const MeusAgendamentos = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
        setAppointments(mockAppointments);
        showSuccess("Seus agendamentos foram carregados!");
      } catch (err) {
        console.error("Erro ao carregar agendamentos:", err);
        setError("Não foi possível carregar seus agendamentos.");
        showError("Erro ao carregar agendamentos.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula API de cancelamento
      setAppointments(prev => prev.map(app =>
        app.id === id ? { ...app, status: 'cancelado' } : app
      ));
      showSuccess("Agendamento cancelado com sucesso!");
    } catch (err) {
      console.error("Erro ao cancelar agendamento:", err);
      showError("Não foi possível cancelar o agendamento.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
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
              <Link to="/client">Voltar ao Painel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Meus Agendamentos</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Visualize e gerencie seus horários agendados.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map(app => (
              <Card key={app.id} className="p-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <div>
                  <p className="text-lg font-semibold">Barbeiro: {app.barberName}</p>
                  <p className="text-gray-700 dark:text-gray-300">Data: {app.date} às {app.time}</p>
                  <p className={`font-medium ${app.status === 'confirmado' ? 'text-green-600' : app.status === 'pendente' ? 'text-yellow-600' : 'text-red-600'}`}>
                    Status: {app.status === 'confirmado' ? 'Confirmado' : app.status === 'pendente' ? 'Pendente' : 'Cancelado'}
                  </p>
                </div>
                {app.status !== 'cancelado' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={loading}>
                        Cancelar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso cancelará seu agendamento com {app.barberName} em {app.date} às {app.time}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Voltar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleCancelAppointment(app.id)}>
                          Sim, cancelar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </Card>
            ))
          ) : (
            <p className="text-center text-lg text-gray-600 dark:text-gray-400">Você não tem agendamentos futuros.</p>
          )}
          <div className="flex justify-center mt-6">
            <Button asChild variant="outline" className="w-full max-w-xs h-12 text-lg">
              <Link to="/client">Voltar ao Painel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeusAgendamentos;