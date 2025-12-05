import React from 'react';
// --- 1. Import the new generic page ---
import GenericContentPage from '../GenericContentPage'; 

const ProfilePage: React.FC = () => {
  // --- 2. Use the generic page component ---
  return <GenericContentPage pageTitle="Profile Settings" />;
};

export default ProfilePage;