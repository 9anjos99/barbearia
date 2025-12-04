"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { showSuccess, showError } from '@/utils/toast';
import { Link, useNavigate } from 'react-router-dom';

// Mock de dados
interface BarberProfile {
  id: string;
  nome: string;
  email: string;
  descricao: string;
  fotoUrl: string;
  servicos: string[];
}

const mockBarberProfile: BarberProfile = {
  id: 'b1',
  nome: 'João Barbeiro',
  email: 'joao.barbeiro@example.com',
  descricao: 'Especialista em cortes clássicos e modernos. Com mais de 10 anos de experiência, garanto um visual impecável e atendimento de primeira.',
  fotoUrl: 'https://github.com/shadcn.png',
  servicos: ['Corte Masculino', 'Barba', 'Corte e Barba', 'Relaxamento'],
};

const EditarPerfilBarbeiro = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<BarberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [servicos, setServicos] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
        setProfile(mockBarberProfile);
        setNome(mockBarberProfile.nome);
        setEmail(mockBarberProfile.email);
        setDescricao(mockBarberProfile.descricao);
        setFotoUrl(mockBarberProfile.fotoUrl);
        setServicos(mockBarberProfile.servicos.join(', '));
        showSuccess("Perfil carregado para edição!");
      } catch (err) {
        console.error("Erro ao carregar perfil do barbeiro:", err);
        setError("Não foi possível carregar seu perfil.");
        showError("Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !descricao) {
      showError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula API de salvamento
      // Aqui você faria a chamada real para o Supabase para atualizar o perfil
      const updatedProfile: BarberProfile = {
        ...mockBarberProfile, // Manter o ID e outros campos que não estão no formulário
        nome,
        email,
        descricao,
        fotoUrl,
        servicos: servicos.split(',').map(s => s.trim()).filter(s => s !== ''),
      };
      setProfile(updatedProfile);
      showSuccess("Perfil atualizado com sucesso!");
      navigate('/barber'); // Redireciona de volta para o dashboard
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      showError("Não foi possível salvar as alterações no perfil.");
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
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
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
              <Link to="/barber">Voltar ao Painel</Link>
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
          <CardTitle className="text-3xl">Editar Perfil do Barbeiro</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Atualize suas informações e serviços.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required disabled={loading} />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={4} required disabled={loading} />
            </div>
            <div>
              <Label htmlFor="fotoUrl">URL da Foto de Perfil</Label>
              <Input id="fotoUrl" type="url" value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} disabled={loading} />
            </div>
            <div>
              <Label htmlFor="servicos">Serviços (separados por vírgula)</Label>
              <Input id="servicos" type="text" value={servicos} onChange={(e) => setServicos(e.target.value)} placeholder="Corte, Barba, Coloração" disabled={loading} />
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button asChild variant="outline" className="w-full h-12 text-lg" disabled={loading}>
              <Link to="/barber">Cancelar</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditarPerfilBarbeiro;