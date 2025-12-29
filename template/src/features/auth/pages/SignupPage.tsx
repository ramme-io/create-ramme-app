import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useCrudLocalStorage } from '../../../engine/runtime/useCrudLocalStorage';
import { Button, Card, FormTemplate, Alert, Icon, type FormField } from '@ramme-io/ui';
// Import SEED_USERS to safe-guard initialization if the DB is empty
import { SEED_USERS, type User } from '../../../data/mockData';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // ✅ DATA HOOK: Direct access to the User Data Lake
  // This ensures new users are saved to 'ramme_db_users' alongside seed data
  const { data: users, createItem } = useCrudLocalStorage<User>('ramme_db_users', SEED_USERS);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (formData: Record<string, any>) => {
    setIsLoading(true);
    setError(null);

    // 1. Validation: Check for duplicates
    if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
      setError('An account with this email already exists.');
      setIsLoading(false);
      return;
    }

    try {
      // 2. Create the User Record in the Data Lake
      // We cast to 'User' because we handle the 'id' generation in createItem
      const newUser = {
        name: formData.name,
        email: formData.email,
        role: 'viewer', // Default role for new signups
        status: 'active',
        joinedAt: new Date().toISOString().split('T')[0],
        // In a real app, you'd hash the password here.
        // For this prototype, the presence of the record implies access.
      } as User;

      createItem(newUser);

      // 3. Auto-Login immediately after creation
      await login(formData.email, formData.password);
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  const formFields: FormField[] = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Doe', required: true },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'jane@example.com', required: true },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 3 characters', required: true },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-t-secondary">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4 text-secondary">
            <Icon name="user-plus" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join the platform to get started</p>
        </div>
        
        {error && <Alert variant="danger" title="Registration Failed" className="mb-4">{error}</Alert>}
        
        <FormTemplate
          fields={formFields}
          onSubmit={handleSignup}
        >
          <Button type="submit" loading={isLoading} className="w-full mt-4" size="lg" variant="secondary">
            Create Account
          </Button>
        </FormTemplate>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;