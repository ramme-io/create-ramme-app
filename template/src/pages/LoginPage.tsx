import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, FormTemplate, Alert, Icon, type FormField } from '@ramme-io/ui';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (formData: Record<string, any>) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await login(formData.username, formData.password);
      if (user) {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const formFields: FormField[] = [
    { name: 'username', label: 'Username', type: 'text', placeholder: 'e.g., jane' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'e.g., password' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Icon name="layout-template" size={48} className="text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-text">Welcome to Ramme</h1>
          <p className="text-muted-foreground">Please sign in to continue</p>
        </div>
        
        {error && <Alert variant="danger" title="Login Failed" className="mb-4">{error}</Alert>}
        
        <FormTemplate
          fields={formFields}
          onSubmit={handleLogin}
        >
          <Button type="submit" loading={isLoading} className="w-full">
            Sign In
          </Button>
        </FormTemplate>
      </Card>
    </div>
  );
};

export default LoginPage;