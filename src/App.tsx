import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import BarberDashboard from "./pages/BarberDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import BuscarBarbeiro from "./pages/BuscarBarbeiro";
import PerfilBarbeiro from "./pages/PerfilBarbeiro";
import AgendarHorario from "./pages/AgendarHorario";
import MinhaDisponibilidade from "./pages/MinhaDisponibilidade";
import BarberAgendamentos from "./pages/BarberAgendamentos";
import MeusAgendamentos from "./pages/MeusAgendamentos";
import GerenciarBarbeiros from "./pages/GerenciarBarbeiros";
import GerenciarUsuarios from "./pages/GerenciarUsuarios";
import VerTodasAgendas from "./pages/VerTodasAgendas";
import EditarPerfilBarbeiro from "./pages/EditarPerfilBarbeiro";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rotas Protegidas */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/barber"
              element={
                <ProtectedRoute allowedRoles={['barber']}>
                  <BarberDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />

            {/* Rotas do Cliente */}
            <Route
              path="/buscar"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <BuscarBarbeiro />
                </ProtectedRoute>
              }
            />
            <Route
              path="/barbeiro/:id"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <PerfilBarbeiro />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agendar/:barberId/:timeSlotId"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <AgendarHorario />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meus-agendamentos"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <MeusAgendamentos />
                </ProtectedRoute>
              }
            />

            {/* Rotas do Barbeiro */}
            <Route
              path="/barber/disponibilidade"
              element={
                <ProtectedRoute allowedRoles={['barber']}>
                  <MinhaDisponibilidade />
                </ProtectedRoute>
              }
            />
            <Route
              path="/barber/agendamentos"
              element={
                <ProtectedRoute allowedRoles={['barber']}>
                  <BarberAgendamentos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/barber/editar-perfil"
              element={
                <ProtectedRoute allowedRoles={['barber']}>
                  <EditarPerfilBarbeiro />
                </ProtectedRoute>
              }
            />

            {/* Rotas do Administrador */}
            <Route
              path="/admin/gerenciar-barbeiros"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <GerenciarBarbeiros />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/gerenciar-usuarios"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <GerenciarUsuarios />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/ver-todas-agendas"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <VerTodasAgendas />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;