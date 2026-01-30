import { supabase } from '../supabaseClient';
import { User, AuthError, Session } from '@supabase/supabase-js';
import { UserRole, isValidRole } from '../config/rolePermissions';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface UserWithRole extends User {
  role?: UserRole;
  clientId?: string;
}

/**
 * Authentication Service
 * Handles all Supabase authentication operations
 */
export const authService = {
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return {
        user: data.user,
        session: data.session,
        error,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  },

  /**
   * Sign up new user with email and password
   */
  async signUp(email: string, password: string, fullName?: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
          }
        }
      });

      // If auth user was created successfully, create corresponding public.users entry
      if (data.user && !error) {
        try {
          // Create public.users entry with is_active = false (requires admin approval)
          const { error: insertError } = await supabase.from('users').insert([{
            id: data.user.id, // Use the same UUID from auth.users
            email: email,
            full_name: fullName || email.split('@')[0],
            role: 'viewer', // Default role
            is_active: false, // Inactive until admin approves
          }]);
          
          if (insertError) {
            console.error('Failed to create public user entry:', insertError);
            // Return error to inform user
            return {
              user: null,
              session: null,
              error: {
                message: `Account created but profile setup failed: ${insertError.message}. Please contact administrator.`,
                status: 500,
              } as AuthError,
            };
          }
        } catch (publicUserError) {
          console.error('Exception creating public user entry:', publicUserError);
        }
      }

      return {
        user: data.user,
        session: data.session,
        error,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      // Get current user before signing out
      const { data: { user } } = await supabase.auth.getUser();
      
      // Clear session_id from database
      if (user) {
        await supabase
          .from('users')
          .update({ session_id: null })
          .eq('id', user.id);
      }
      
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as AuthError };
    }
  },

  /**
   * Send password reset email
   */
  async forgotPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { error: error as AuthError };
    }
  },

  /**
   * Update user password (requires current session)
   */
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: error as AuthError };
    }
  },

  /**
   * Get current user session
   */
  async getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      return {
        session: data.session,
        error,
      };
    } catch (error) {
      console.error('Get session error:', error);
      return {
        session: null,
        error: error as AuthError,
      };
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getUser();
      return {
        user: data.user,
        error,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        user: null,
        error: error as AuthError,
      };
    }
  },

  /**
   * Get current user with role information
   */
  async getCurrentUserWithRole(): Promise<{ 
    user: UserWithRole | null; 
    role: UserRole | null;
    clientId: string | null;
    error: AuthError | null 
  }> {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        return { user: null, role: null, clientId: null, error };
      }

      // Fetch user role from user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role, client_id')
        .eq('user_id', data.user.id)
        .single();

      if (roleError || !roleData) {
        console.error('Error fetching user role:', roleError);
        return { 
          user: data.user as UserWithRole, 
          role: null, 
          clientId: null,
          error: null 
        };
      }

      if (!isValidRole(roleData.role)) {
        console.error('Invalid role for user:', roleData.role);
        return { 
          user: data.user as UserWithRole, 
          role: null, 
          clientId: null,
          error: null 
        };
      }

      const userWithRole: UserWithRole = {
        ...data.user,
        role: roleData.role as UserRole,
        clientId: roleData.client_id,
      };

      return {
        user: userWithRole,
        role: roleData.role as UserRole,
        clientId: roleData.client_id,
        error: null,
      };
    } catch (error) {
      console.error('Get current user with role error:', error);
      return {
        user: null,
        role: null,
        clientId: null,
        error: error as AuthError,
      };
    }
  },

  /**
   * Check if user has required role
   */
  async checkUserRole(requiredRole: UserRole): Promise<boolean> {
    try {
      const { role } = await this.getCurrentUserWithRole();
      return role === requiredRole;
    } catch (error) {
      console.error('Check user role error:', error);
      return false;
    }
  },

  /**
   * Check if user has any of the required roles
   */
  async checkUserRoles(requiredRoles: UserRole[]): Promise<boolean> {
    try {
      const { role } = await this.getCurrentUserWithRole();
      return role ? requiredRoles.includes(role) : false;
    } catch (error) {
      console.error('Check user roles error:', error);
      return false;
    }
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });

    return subscription;
  },
};
