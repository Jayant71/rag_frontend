import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { signIn, signUp, signOut, resetPassword } from '@/lib/supabase';

export function useAuth() {
  const { user, loading, initialized, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleSignIn = async (email: string, password: string) => {
    const { data, error } = await signIn(email, password);
    if (error) throw error;
    return data;
  };

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await signUp(email, password, fullName);
    if (error) throw error;
    return data;
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) throw error;
  };

  const handleResetPassword = async (email: string) => {
    const { data, error } = await resetPassword(email);
    if (error) throw error;
    return data;
  };

  return {
    user,
    loading,
    initialized,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
  };
}
