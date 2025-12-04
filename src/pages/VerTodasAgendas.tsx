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
  clientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: 'pendente' | 'confirmado' | 'recusado' | 'cancelado';
}

const mockAllAppointments: Appointment[] = [
  { id: 'a1', barberName: 'João Barbeiro', clientName: 'Maria Silva', date: '2024-10-26', time: '09:00', status: 'confirmado' },
  { id: 'a2', barberName: 'Maria Tesoura', clientName: 'Carlos Souza', date: '2024-10-26', time: '13:00', status: 'pendente' },
  { id: 'a3', barberName: 'Pedro Navalha', clientName: 'Ana Paula', date: '2024-10-27', time: '14:00', status: 'recusado' },
  { id: 'a4', barberName: 'João Barbeiro', clientName: 'Fernanda Lima', date: '2024-10-28', time: '10:00', status: 'confirmado' },
];

const VerTodasAgendas = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
        setAppointments(mockAllAppointments);
        showSuccess("Todas as agendas foram carregadas!");
      } catch (err) {
        console.error("Erro ao carregar todas as agendas:", err);
        setError("Não foi possível carregar todas as agendas.");
        showError("Erro ao carregar agendas.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllAppointments();
  }, []);

  const handleUpdateAppointmentStatus = async (id: string, newStatus: 'confirmado' | 'recusado' | 'cancelado') => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula API de atualização
      setAppointments(prev => prev.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      ));
      showSuccess(`Agendamento ${newStatus} com sucesso!`);
    } catch (err) {
      console.error("Erro ao atualizar status do agendamento:", err);
      showError("Não foi possível atualizar o status do agendamento.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAppointment = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula API de remoção
      setAppointments(prev => prev.filter(app => app.id !== id));
      showSuccess("Agendamento removido com sucesso!");
    } catch (err) {
      console.error("Erro ao remover agendamento:", err);
      showError("Não foi possível remover o agendamento.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-4xl">
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
              <Link to="/admin">Voltar ao Painel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-4xl mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Todas as Agendas</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Visualize e gerencie todos os agendamentos do sistema.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map(app => (
                <Card key={app.id} className="p-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                  <div>
                    <p className="text-lg font-semibold">Barbeiro: {app.barberName}</p>
                    <p className="text-gray-700 dark:text-gray-300">Cliente: {app.clientName}</p>
                    <p className="text-gray-700 dark:text-gray-300">Data: {app.date} às {app.time}</p>
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
                        <Button onClick={() => handleUpdateAppointmentStatus(app.id, 'recusado')} variant="secondary" disabled={loading}>
                          Recusar
                        </Button>
                      </>
                    )}
                    {app.status !== 'cancelado' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" disabled={loading}>
                            Remover
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação removerá permanentemente o agendamento de {app.clientName} com {app.barberName} em {app.date} às {app.time}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Voltar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveAppointment(app.id)}>
                              Sim, remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-lg text-gray-600 dark:text-gray-400">Nenhum agendamento encontrado.</p>
          )}
          <div className="flex justify-center mt-6">
            <Button asChild variant="outline" className="w-full max-w-xs h-12 text-lg">
              <Link to="/admin">Voltar ao Painel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerTodasAgendas;