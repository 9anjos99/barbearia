"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-600 dark:text-gray-400">Loading application...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect authenticated users to their respective dashboards
    switch (userRole) {
      case 'admin':
        return <Link to="/admin" replace />;
      case 'barber':
        return <Link to="/barber" replace />;
      case 'client':
        return <Link to="/client" replace />;
      default:
        // Fallback for unexpected roles or if role is null but authenticated
        return <Link to="/client" replace />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Welcome to Barbershop Scheduler
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Your one-stop solution for managing barbershop appointments.
          Clients can book, barbers can manage their schedules, and admins have full control.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button asChild size="lg" className="text-lg px-8 py-4">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg px-8 py-4">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;