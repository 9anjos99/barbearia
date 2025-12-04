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
interface User {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'barber' | 'client';
  status: 'ativo' | 'banido';
}

const mockUsers: User[] = [
  { id: 'u1', nome: 'João Admin', email: 'admin@example.com', role: 'admin', status: 'ativo' },
  { id: 'u2', nome: 'Maria Cliente', email: 'maria.c@example.com', role: 'client', status: 'ativo' },
  { id: 'u3', nome: 'Pedro Barbeiro', email: 'pedro.b@example.com', role: 'barber', status: 'ativo' },
  { id: 'u4', nome: 'Ana Banida', email: 'ana.b@example.com', role: 'client', status: 'banido' },
];

const GerenciarUsuarios = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
        setUsers(mockUsers);
        showSuccess("Lista de usuários carregada!");
      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
        setError("Não foi possível carregar a lista de usuários.");
        showError("Erro ao carregar usuários.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleBanUnbanUser = async (id: string, currentStatus: 'ativo' | 'banido') => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula API de ban/unban
      const newStatus = currentStatus === 'ativo' ? 'banido' : 'ativo';
      setUsers(prev => prev.map(user =>
        user.id === id ? { ...user, status: newStatus } : user
      ));
      showSuccess(`Usuário ${newStatus === 'banido' ? 'banido' : 'desbanido'} com sucesso!`);
    } catch (err) {
      console.error("Erro ao banir/desbanir usuário:", err);
      showError("Não foi possível atualizar o status do usuário.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula API de remoção
      setUsers(prev => prev.filter(user => user.id !== id));
      showSuccess("Usuário removido com sucesso!");
    } catch (err) {
      console.error("Erro ao remover usuário:", err);
      showError("Não foi possível remover o usuário.");
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
          <CardTitle className="text-3xl">Gerenciar Usuários</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Visualize e gerencie todos os usuários do sistema.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Lista de Usuários</h2>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map(user => (
                <Card key={user.id} className="p-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                  <div>
                    <p className="text-lg font-semibold">{user.nome} ({user.role === 'admin' ? 'Administrador' : user.role === 'barber' ? 'Barbeiro' : 'Cliente'})</p>
                    <p className="text-gray-700 dark:text-gray-300">{user.email}</p>
                    <p className={`font-medium ${user.status === 'ativo' ? 'text-green-600' : 'text-red-600'}`}>
                      Status: {user.status === 'ativo' ? 'Ativo' : 'Banido'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {user.role !== 'admin' && ( // Admin não pode banir/remover outro admin
                      <>
                        <Button
                          onClick={() => handleBanUnbanUser(user.id, user.status)}
                          variant={user.status === 'ativo' ? 'secondary' : 'default'}
                          disabled={loading}
                        >
                          {user.status === 'ativo' ? 'Banir' : 'Desbanir'}
                        </Button>
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
                                Esta ação removerá permanentemente o usuário {user.nome} do sistema.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Voltar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRemoveUser(user.id)}>
                                Sim, remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-lg text-gray-600 dark:text-gray-400">Nenhum usuário cadastrado.</p>
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

export default GerenciarUsuarios;