"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { showSuccess, showError } from '@/utils/toast';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

// Mock de dados
interface Barber {
  id: string;
  nome: string;
  email: string;
  status: 'ativo' | 'pendente' | 'banido';
}

const mockBarbers: Barber[] = [
  { id: 'b1', nome: 'João Barbeiro', email: 'joao@example.com', status: 'ativo' },
  { id: 'b2', nome: 'Maria Tesoura', email: 'maria@example.com', status: 'pendente' },
  { id: 'b3', nome: 'Pedro Navalha', email: 'pedro@example.com', status: 'ativo' },
];

const GerenciarBarbeiros = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newBarberName, setNewBarberName] = useState('');
  const [newBarberEmail, setNewBarberEmail] = useState('');
  const [isAddBarberDialogOpen, setIsAddBarberDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBarbers = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
        setBarbers(mockBarbers);
        showSuccess("Lista de barbeiros carregada!");
      } catch (err) {
        console.error("Erro ao carregar barbeiros:", err);
        setError("Não foi possível carregar a lista de barbeiros.");
        showError("Erro ao carregar barbeiros.");
      } finally {
        setLoading(false);
      }
    };
    fetchBarbers();
  }, []);

  const handleAddBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBarberName || !newBarberEmail) {
      showError("Por favor, preencha nome e e-mail para o novo barbeiro.");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula API de adição
      const newBarber: Barber = {
        id: `b${Date.now()}`,
        nome: newBarberName,
        email: newBarberEmail,
        status: 'pendente', // Novos barbeiros podem começar como pendentes
      };
      setBarbers(prev => [...prev, newBarber]);
      setNewBarberName('');
      setNewBarberEmail('');
      setIsAddBarberDialogOpen(false);
      showSuccess("Barbeiro adicionado com sucesso! Status: Pendente.");
    } catch (err) {
      console.error("Erro ao adicionar barbeiro:", err);
      showError("Não foi possível adicionar o barbeiro.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBarber = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula API de remoção
      setBarbers(prev => prev.filter(barber => barber.id !== id));
      showSuccess("Barbeiro removido com sucesso!");
    } catch (err) {
      console.error("Erro ao remover barbeiro:", err);
      showError("Não foi possível remover o barbeiro.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBarber = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula API de aprovação
      setBarbers(prev => prev.map(barber =>
        barber.id === id ? { ...barber, status: 'ativo' } : barber
      ));
      showSuccess("Barbeiro aprovado com sucesso!");
    } catch (err) {
      console.error("Erro ao aprovar barbeiro:", err);
      showError("Não foi possível aprovar o barbeiro.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
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
              <Link to="/admin">Voltar ao Painel</Link>
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
          <CardTitle className="text-3xl">Gerenciar Barbeiros</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Adicione, remova e aprove barbeiros.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Dialog open={isAddBarberDialogOpen} onOpenChange={setIsAddBarberDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full h-12 text-lg">Adicionar Novo Barbeiro</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Barbeiro</DialogTitle>
                <DialogDescription>
                  Preencha os dados para adicionar um novo barbeiro ao sistema.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddBarber} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    value={newBarberName}
                    onChange={(e) => setNewBarberName(e.target.value)}
                    className="col-span-3"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newBarberEmail}
                    onChange={(e) => setNewBarberEmail(e.target.value)}
                    className="col-span-3"
                    required
                    disabled={loading}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Adicionando...' : 'Adicionar Barbeiro'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <h2 className="text-2xl font-semibold text-center mt-8">Lista de Barbeiros</h2>
          {barbers.length > 0 ? (
            <div className="space-y-4">
              {barbers.map(barber => (
                <Card key={barber.id} className="p-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                  <div>
                    <p className="text-lg font-semibold">{barber.nome}</p>
                    <p className="text-gray-700 dark:text-gray-300">{barber.email}</p>
                    <p className={`font-medium ${barber.status === 'ativo' ? 'text-green-600' : barber.status === 'pendente' ? 'text-yellow-600' : 'text-red-600'}`}>
                      Status: {barber.status === 'ativo' ? 'Ativo' : barber.status === 'pendente' ? 'Pendente' : 'Banido'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {barber.status === 'pendente' && (
                      <Button onClick={() => handleApproveBarber(barber.id)} disabled={loading}>
                        Aprovar
                      </Button>
                    )}
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
                            Esta ação removerá permanentemente o barbeiro {barber.nome} do sistema.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Voltar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemoveBarber(barber.id)}>
                            Sim, remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-lg text-gray-600 dark:text-gray-400">Nenhum barbeiro cadastrado.</p>
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

export default GerenciarBarbeiros;