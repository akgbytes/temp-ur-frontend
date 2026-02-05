// Authentication utility functions

/**
 * Check if user is authenticated by looking for token in cookies
 * This is a client-side check
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  // Check for token in cookies (backend sets 'urbanesta_token')
  // Note: Since backend sets httpOnly cookies, we can't read them directly
  // This function will always return false on client-side
  // Authentication should be checked via API calls instead
  return false;
};

/**
 * Get authentication token from cookies
 */
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('urbanesta_token='))
    ?.split('=')[1];
  
  return token || null;
};

/**
 * Set authentication token in cookies
 */
export const setAuthToken = (token, expiresInDays = 30) => {
  if (typeof window === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (expiresInDays * 24 * 60 * 60 * 1000));
  
  document.cookie = `urbanesta_token=${token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
};

/**
 * Remove authentication token from cookies
 */
export const removeAuthToken = () => {
  if (typeof window === 'undefined') return;
  
  document.cookie = 'urbanesta_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

/**
 * Redirect to home page if not authenticated
 */
export const redirectIfNotAuthenticated = (router) => {
  if (!isAuthenticated()) {
    router.replace('/');
    return true;
  }
  return false;
};
