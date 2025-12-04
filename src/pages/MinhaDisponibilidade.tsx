"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { showSuccess, showError } from '@/utils/toast';
import { Link } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
interface TimeSlot {
  id: string;
  data: string; // YYYY-MM-DD
  horario: string; // HH:MM
  disponivel: boolean;
}

const mockBarberTimeSlots: TimeSlot[] = [
  { id: 'ts1', data: '2024-10-26', horario: '09:00', disponivel: true },
  { id: 'ts2', data: '2024-10-26', horario: '10:00', disponivel: true },
  { id: 'ts3', data: '2024-10-27', horario: '14:00', disponivel: true },
  { id: 'ts4', data: '2024-10-27', horario: '15:00', disponivel: false }, // Exemplo de horário ocupado
];

const MinhaDisponibilidade = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
        setTimeSlots(mockBarberTimeSlots);
        showSuccess("Sua disponibilidade foi carregada!");
      } catch (err) {
        console.error("Erro ao carregar disponibilidade:", err);
        setError("Não foi possível carregar sua disponibilidade.");
        showError("Erro ao carregar disponibilidade.");
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const handleAddTimeSlot = async () => {
    if (!selectedDate || !newTime) {
      showError("Por favor, selecione uma data e insira um horário.");
      return;
    }

    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const newSlot: TimeSlot = {
      id: `ts${Date.now()}`, // ID temporário
      data: formattedDate,
      horario: newTime,
      disponivel: true,
    };

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula API de adição
      setTimeSlots(prev => [...prev, newSlot]);
      setNewTime('');
      showSuccess("Horário adicionado com sucesso!");
    } catch (err) {
      console.error("Erro ao adicionar horário:", err);
      showError("Não foi possível adicionar o horário.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTimeSlot = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula API de remoção
      setTimeSlots(prev => prev.filter(slot => slot.id !== id));
      showSuccess("Horário removido com sucesso!");
    } catch (err) {
      console.error("Erro ao remover horário:", err);
      showError("Não foi possível remover o horário.");
    } finally {
      setLoading(false);
    }
  };

  const slotsForSelectedDate = timeSlots.filter(slot =>
    selectedDate && isSameDay(new Date(slot.data), selectedDate)
  ).sort((a, b) => a.horario.localeCompare(b.horario));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-12 w-full" />
            {[1, 2].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
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
      <Card className="w-full max-w-4xl mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Minha Disponibilidade</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Gerencie seus horários disponíveis para agendamento.</p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-8">
            <div className="flex-shrink-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                locale={ptBR}
                className="rounded-md border shadow"
              />
            </div>
            <div className="flex-grow w-full md:w-auto space-y-4">
              <h3 className="text-xl font-medium text-center md:text-left">
                Horários para {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }) : 'selecione uma data'}
              </h3>
              <div className="flex flex-col gap-3">
                {slotsForSelectedDate.length > 0 ? (
                  slotsForSelectedDate.map(slot => (
                    <div key={slot.id} className="flex justify-between items-center p-3 border rounded-md">
                      <span>{slot.horario} - {slot.disponivel ? 'Disponível' : 'Ocupado'}</span>
                      {slot.disponivel && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={loading}>Remover</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação removerá o horário {slot.horario} da sua disponibilidade para {format(new Date(slot.data), 'dd/MM/yyyy', { locale: ptBR })}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Voltar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRemoveTimeSlot(slot.id)}>
                                Sim, remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">Nenhum horário cadastrado para esta data.</p>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <Label htmlFor="new-time">Adicionar novo horário (HH:MM)</Label>
                <div className="flex gap-2">
                  <Input
                    id="new-time"
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full"
                    disabled={loading}
                  />
                  <Button onClick={handleAddTimeSlot} disabled={loading || !selectedDate || !newTime}>
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button asChild variant="outline" className="w-full max-w-xs h-12 text-lg">
              <Link to="/barber">Voltar ao Painel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinhaDisponibilidade;