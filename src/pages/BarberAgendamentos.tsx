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
  clienteNome: string;
  data: string; // YYYY-MM-DD
  horario: string; // HH:MM
  status: 'pendente' | 'confirmado' | 'recusado' | 'cancelado';
}

const mockBarberAppointments: Appointment[] = [
  { id: 'app1', clienteNome: 'Maria Silva', data: '2024-10-26', horario: '10:00', status: 'pendente' },
  { id: 'app2', clienteNome: 'Carlos Souza', data: '2024-10-25', horario: '11:00', status: 'confirmado' },
  { id: 'app3', clienteNome: 'Ana Paula', data: '2024-10-27', horario: '14:00', status: 'pendente' },
  { id: 'app4', clienteNome: 'João Pedro', data: '2024-10-24', horario: '09:00', status: 'recusado' },
];

const BarberAgendamentos = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
        setAppointments(mockBarberAppointments);
        showSuccess("Seus agendamentos foram carregados!");
      } catch (err) {
        console.error("Erro ao carregar agendamentos do barbeiro:", err);
        setError("Não foi possível carregar seus agendamentos.");
        showError("Erro ao carregar agendamentos.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleUpdateAppointmentStatus = async (id: string, newStatus: 'confirmado' | 'recusado') => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula API de atualização
      setAppointments(prev => prev.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      ));
      showSuccess(`Agendamento ${newStatus === 'confirmado' ? 'confirmado' : 'recusado'} com sucesso!`);
    } catch (err) {
      console.error("Erro ao atualizar status do agendamento:", err);
      showError("Não foi possível atualizar o status do agendamento.");
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
              <Skeleton key={i} className="h-24 w-full" />
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
              <Link to="/barber">Voltar ao Painel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-3xl mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Meus Agendamentos</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Gerencie os agendamentos dos seus clientes.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map(app => (
              <Card key={app.id} className="p-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                <div>
                  <p className="text-lg font-semibold">Cliente: {app.clienteNome}</p>
                  <p className="text-gray-700 dark:text-gray-300">Data: {app.data} às {app.horario}</p>
                  <p className={`font-medium ${app.status === 'confirmado' ? 'text-green-600' : app.status === 'pendente' ? 'text-yellow-600' : app.status === 'recusado' ? 'text-red-600' : 'text-gray-600'}`}>
                    Status: {app.status === 'confirmado' ? 'Confirmado' : app.status === 'pendente' ? 'Pendente' : app.status === 'recusado' ? 'Recusado' : 'Cancelado'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {app.status === 'pendente' && (
                    <>
                      <Button onClick={() => handleUpdateAppointmentStatus(app.id, 'confirmado')} disabled={loading}>
                        Confirmar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" disabled={loading}>
                            Recusar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação recusará o agendamento do cliente {app.clienteNome} em {app.data} às {app.horario}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Voltar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleUpdateAppointmentStatus(app.id, 'recusado')}>
                              Sim, recusar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-lg text-gray-600 dark:text-gray-400">Você não tem agendamentos.</p>
          )}
          <div className="flex justify-center mt-6">
            <Button asChild variant="outline" className="w-full max-w-xs h-12 text-lg">
              <Link to="/barber">Voltar ao Painel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarberAgendamentos;