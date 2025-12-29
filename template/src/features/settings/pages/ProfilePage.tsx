import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Input, 
  Card, 
  SectionHeader, 
  Icon, 
  Alert 
} from '@ramme-io/ui';
import { useAuth } from '../../auth/AuthContext';

// 1. REMOVE Zombie Service
// import { userService } from '../../users/api/user.service';

// 2. ADD Engine Hooks & Data
import { useCrudLocalStorage } from '../../../engine/runtime/useCrudLocalStorage';
import { SEED_USERS, type User } from '../../../data/mockData';

const ProfilePage: React.FC = () => {
  const { user } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // 3. CONNECT to Data Lake
  // We only need 'updateItem' here to modify the existing profile
  const { updateItem } = useCrudLocalStorage<User>('ramme_db_users', SEED_USERS);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    bio: 'Product Designer based in San Francisco.'
  });

  // Load current user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        bio: 'Product Designer based in San Francisco.'
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);

    try {
      if (user?.id) {
        // 4. USE ENGINE to update the record in the Data Lake
        // We merge the existing user object with the new form data
        updateItem({ ...user, ...formData } as User);

        // 5. REFRESH SESSION (Local hack to update UI header immediately)
        // In a real app, AuthContext would listen to storage changes, but this is fine for a prototype.
        localStorage.setItem('ramme_session', JSON.stringify({ ...user, ...formData }));
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <SectionHeader title="My Profile"  />

      {success && (
        <Alert variant="info" title="Changes Saved">
          Your profile has been updated successfully.
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Avatar Card */}
        <Card className="p-6 flex flex-col items-center text-center space-y-4 h-fit">
          <div className="relative group cursor-pointer">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary border-4 border-background shadow-sm">
              {formData.name.charAt(0)}
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Icon name="camera" className="text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg">{formData.name}</h3>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 uppercase">
              {formData.role}
            </span>
          </div>
          <div className="w-full pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-4">Joined December 2024</p>
            <Button variant="outline" className="w-full" size="sm">Change Avatar</Button>
          </div>
        </Card>

        {/* Right Column - Form */}
        <Card className="md:col-span-2 p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-2">
              <h3 className="font-semibold text-lg">Personal Information</h3>
              <p className="text-sm text-muted-foreground">Update your personal details here.</p>
            </div>

            <div className="grid gap-4 py-4">
              <Input 
                label="Full Name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
              />
              <Input 
                label="Email Address" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
              />
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Bio</label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.bio}
                  disabled
                />
                <p className="text-[0.8rem] text-muted-foreground">Bio editing is disabled in this demo.</p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;