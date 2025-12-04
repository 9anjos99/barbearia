"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { showSuccess, showError } from '@/utils/toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Mock de dados para simular barbeiros
interface Barber {
  id: string;
  nome: string;
  descricao: string;
  fotoUrl: string;
  rating: number;
}

const mockBarbers: Barber[] = [
  { id: 'b1', nome: 'João Barbeiro', descricao: 'Especialista em cortes clássicos e modernos.', fotoUrl: 'https://github.com/shadcn.png', rating: 4.8 },
  { id: 'b2', nome: 'Maria Tesoura', descricao: 'Cortes femininos e masculinos, coloração e tratamentos.', fotoUrl: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Maria', rating: 4.9 },
  { id: 'b3', nome: 'Pedro Navalha', descricao: 'Barbas impecáveis e design de sobrancelhas.', fotoUrl: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Pedro', rating: 4.5 },
  { id: 'b4', nome: 'Ana Estilosa', descricao: 'Últimas tendências em cortes e penteados.', fotoUrl: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Ana', rating: 4.7 },
];

const BuscarBarbeiro = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simular chamada de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBarbers(mockBarbers);
        showSuccess("Barbeiros carregados com sucesso!");
      } catch (err) {
        console.error("Erro ao buscar barbeiros:", err);
        setError("Não foi possível carregar a lista de barbeiros.");
        showError("Erro ao carregar barbeiros.");
      } finally {
        setLoading(false);
      }
    };
    fetchBarbers();
  }, []);

  const filteredBarbers = barbers.filter(barber =>
    barber.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-4xl mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Procurar Barbeiro</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Encontre o barbeiro perfeito para você!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            type="text"
            placeholder="Digite o nome do barbeiro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 text-lg"
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="flex items-center space-x-4 p-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 text-lg">{error}</div>
          ) : filteredBarbers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBarbers.map(barber => (
                <Link to={`/barbeiro/${barber.id}`} key={barber.id}>
                  <Card className="flex flex-col items-center p-6 hover:shadow-lg transition-shadow duration-200">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage src={barber.fotoUrl} alt={barber.nome} />
                      <AvatarFallback>{barber.nome.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold mb-1">{barber.nome}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">{barber.descricao}</p>
                    <div className="flex items-center text-yellow-500">
                      <span>⭐ {barber.rating}</span>
                    </div>
                    <Button className="mt-4 w-full">Ver Perfil</Button>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-lg text-gray-600 dark:text-gray-400">Nenhum barbeiro encontrado com este nome.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BuscarBarbeiro;