import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
// 1. Remove 'Card' from imports
import { Button, Alert, Icon, Input } from '@ramme-io/ui';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 transition-colors duration-300">
      
      {/* 2. REPLACED <Card> with a native <div> 
        - Removes conflicting library styles (border-border vs border-t-primary).
        - Adds 'sm:w-[400px]' for better mobile responsiveness.
        - Adds 'bg-card' explicitly for theme support.
      */}
      <div className="w-full sm:w-[400px] p-8 rounded-xl shadow-2xl border-t-4 border-t-primary bg-card ring-1 ring-black/5 dark:ring-white/10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary transition-transform hover:scale-110">
            <Icon name="layout-template" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-2">Enter your credentials to access your account</p>
        </div>
        
        {/* Error State */}
        {error && (
          <Alert variant="danger" title="Access Denied" className="mb-6 animate-in fade-in slide-in-from-top-2">
            {error}
          </Alert>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input 
            name="email"
            label="Email Address" 
            type="email" 
            placeholder="alex@example.com" 
            required 
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            // Explicit background to prevent transparency issues
            className="bg-background"
          />
          
          <div className="space-y-1">
            <Input 
              name="password"
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              required 
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="bg-background"
            />
          </div>

          <Button type="submit" loading={isLoading} className="w-full mt-2 font-medium" size="lg">
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link to="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;