"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth2Factor } from '../contexts/Auth2FactorContext';

const ProtectedRoute = ({ children, fallback = null }) => {
  const { user, loading } = useAuth2Factor();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setIsRedirecting(true);
      // Use replace to prevent back button issues
      router.replace('/');
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="container-fluid" style={{ marginTop: '80px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="container py-4">
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 fs-5 text-muted">Loading your profile...</p>
            <p className="text-muted small">Please wait while we verify your authentication</p>
          </div>
        </div>
      </div>
    );
  }

  // Show redirecting state for unauthenticated users
  if (!user || isRedirecting) {
    return (
      <div className="container-fluid" style={{ marginTop: '80px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="container py-4">
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 fs-5 text-muted">Redirecting to home page...</p>
            <p className="text-muted small">You need to be logged in to access this page</p>
          </div>
        </div>
      </div>
    );
  }

  // Render the protected content
  return children;
};

export default ProtectedRoute;
