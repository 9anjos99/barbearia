"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { showSuccess, showError } from '@/utils/toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock de dados
interface Barber {
  id: string;
  nome: string;
  descricao: string;
  fotoUrl: string;
  rating: number;
  servicos: string[];
}

interface TimeSlot {
  id: string;
  barberId: string;
  data: string; // YYYY-MM-DD
  horario: string; // HH:MM
  disponivel: boolean;
}

const mockBarbers: Barber[] = [
  { id: 'b1', nome: 'João Barbeiro', descricao: 'Especialista em cortes clássicos e modernos. Com mais de 10 anos de experiência, garanto um visual impecável e atendimento de primeira.', fotoUrl: 'https://github.com/shadcn.png', rating: 4.8, servicos: ['Corte Masculino', 'Barba', 'Corte e Barba', 'Relaxamento'] },
  { id: 'b2', nome: 'Maria Tesoura', descricao: 'Cortes femininos e masculinos, coloração e tratamentos. Minha paixão é transformar e realçar a beleza de cada cliente.', fotoUrl: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Maria', rating: 4.9, servicos: ['Corte Feminino', 'Corte Masculino', 'Coloração', 'Hidratação'] },
  { id: 'b3', nome: 'Pedro Navalha', descricao: 'Barbas impecáveis e design de sobrancelhas. Detalhista e preciso, meu foco é a satisfação total do cliente.', fotoUrl: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Pedro', rating: 4.5, servicos: ['Barba', 'Design de Sobrancelhas', 'Corte Masculino'] },
  { id: 'b4', nome: 'Ana Estilosa', descricao: 'Últimas tendências em cortes e penteados. Sempre atualizada com o que há de novo no mundo da beleza.', fotoUrl: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Ana', rating: 4.7, servicos: ['Corte Feminino', 'Penteados', 'Mechas', 'Maquiagem'] },
];

const mockTimeSlots: TimeSlot[] = [
  { id: 'ts1', barberId: 'b1', data: '2024-10-26', horario: '09:00', disponivel: true },
  { id: 'ts2', barberId: 'b1', data: '2024-10-26', horario: '10:00', disponivel: false },
  { id: 'ts3', barberId: 'b1', data: '2024-10-26', horario: '11:00', disponivel: true },
  { id: 'ts4', barberId: 'b1', data: '2024-10-27', horario: '14:00', disponivel: true },
  { id: 'ts5', barberId: 'b1', data: '2024-10-27', horario: '15:00', disponivel: true },
  { id: 'ts6', barberId: 'b2', data: '2024-10-26', horario: '13:00', disponivel: true },
  { id: 'ts7', barberId: 'b2', data: '2024-10-26', horario: '14:00', disponivel: true },
  { id: 'ts8', barberId: 'b3', data: '2024-10-28', horario: '09:30', disponivel: true },
];

const PerfilBarbeiro = () => {
  const { id } = useParams<{ id: string }>();
  const [barber, setBarber] = useState<Barber | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const fetchBarberProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
        const foundBarber = mockBarbers.find(b => b.id === id);
        if (foundBarber) {
          setBarber(foundBarber);
          showSuccess(`Perfil de ${foundBarber.nome} carregado!`);
        } else {
          setError("Barbeiro não encontrado.");
          showError("Barbeiro não encontrado.");
        }
      } catch (err) {
        console.error("Erro ao carregar perfil do barbeiro:", err);
        setError("Não foi possível carregar o perfil do barbeiro.");
        showError("Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchBarberProfile();
  }, [id]);

  useEffect(() => {
    if (barber && selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const slotsForSelectedDate = mockTimeSlots.filter(
        slot => slot.barberId === barber.id && slot.data === formattedDate && slot.disponivel
      );
      setAvailableTimeSlots(slotsForSelectedDate);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [barber, selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-4xl mt-8">
          <CardHeader className="text-center">
            <Skeleton className="h-10 w-1/2 mx-auto mb-2" />
            <Skeleton className="h-5 w-1/3 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-6 flex flex-col items-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-40 w-full" />
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
              <Link to="/buscar">Voltar para a Busca</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!barber) {
    return null; // Should not happen if error is handled
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-4xl mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">{barber.nome}</CardTitle>
          <p className="text-lg text-gray-600 dark:text-gray-400">⭐ {barber.rating} de 5</p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={barber.fotoUrl} alt={barber.nome} />
              <AvatarFallback className="text-5xl">{barber.nome.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl">{barber.descricao}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">Serviços Oferecidos</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {barber.servicos.map((service, index) => (
                <span key={index} className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm">
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">Agendar Horário</h2>
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
              <div className="flex-grow w-full md:w-auto">
                <h3 className="text-xl font-medium mb-4 text-center md:text-left">
                  Horários disponíveis para {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }) : 'selecione uma data'}
                </h3>
                {availableTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableTimeSlots.map(slot => (
                      <Button asChild key={slot.id} variant="outline" className="h-12 text-base">
                        <Link to={`/agendar/${barber.id}/${slot.id}`}>
                          {slot.horario}
                        </Link>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Nenhum horário disponível para esta data.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button asChild variant="outline" className="w-full max-w-xs h-12 text-lg">
              <Link to="/buscar">Voltar para a Busca</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerfilBarbeiro;