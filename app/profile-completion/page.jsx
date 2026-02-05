"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/header';
import ProfileCompletionForm from '../../components/ProfileCompletionForm';
import { useAuth2Factor } from '../../contexts/Auth2FactorContext';

// Note: Metadata cannot be exported from client components
// SEO metadata should be handled at the layout level or in server components

export default function ProfileCompletion() {
  const router = useRouter();
  const { user, loading, isProfileComplete } = useAuth2Factor();

  useEffect(() => {
    // If user is not authenticated, redirect to home
    if (!loading && !user) {
      router.push('/');
      return;
    }

    // If profile is already complete, redirect to home
    if (!loading && user && isProfileComplete) {
      router.push('/');
      return;
    }
  }, [user, loading, isProfileComplete, router]);

  const handleProfileComplete = () => {
    // Profile completed successfully, redirect to home
    router.push('/');
  };

  const handleSkip = () => {
    // User skipped profile completion, redirect to home
    router.push('/');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container-fluid" style={{ marginTop: '120px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
          <div className="container py-4">
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return null; // Will redirect to home
  }

  if (isProfileComplete) {
    return null; // Will redirect to home
  }

  return (
    <>
      <Header />
      <div className="container-fluid" style={{ marginTop: '120px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <ProfileCompletionForm 
          onComplete={handleProfileComplete}
          onSkip={handleSkip}
        />
      </div>
    </>
  );
}
