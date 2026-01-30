/**
 * ROLE-BASED ACCESS CONTROL HOOK
 * 
 * Provides utilities for checking user permissions and module access
 * based on their assigned role.
 */

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  UserRole, 
  Permission, 
  Module,
  hasPermission as checkPermission,
  hasModuleAccess as checkModuleAccess,
  getRolePermissions,
  getRoleModules,
  isValidRole,
  ROLE_DESCRIPTIONS
} from '../config/rolePermissions';

export interface UserRoleData {
  userId: string;
  email: string;
  role: UserRole;
  clientId?: string; // For client-scoped roles
}

export function useRoleAccess() {
  const [userRole, setUserRole] = useState<UserRoleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initRole() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (!mounted) return;

        if (userError || !user) {
          setUserRole(null);
          setLoading(false);
          return;
        }

        // Fetch user role from user_roles table
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role, client_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!mounted) return;

        if (roleError) {
          console.error('Error fetching user role:', roleError);
          setUserRole(null);
          setLoading(false);
          return;
        }

        if (!roleData) {
          console.warn('No role found for user:', user.email);
          setUserRole(null);
          setLoading(false);
          return;
        }

        if (isValidRole(roleData.role)) {
          setUserRole({
            userId: user.id,
            email: user.email!,
            role: roleData.role as UserRole,
            clientId: roleData.client_id,
          });
        } else {
          console.error('Invalid role:', roleData.role);
          setUserRole(null);
        }
        setLoading(false);
      } catch (error) {
        if (mounted) {
          console.error('Error loading user role:', error);
          setUserRole(null);
          setLoading(false);
        }
      }
    }

    initRole();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        initRole();
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function loadUserRole() {
    // Manual refresh function - kept for backward compatibility
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setUserRole(null);
        return;
      }

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role, client_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (roleError || !roleData) {
        setUserRole(null);
        return;
      }

      if (isValidRole(roleData.role)) {
        setUserRole({
          userId: user.id,
          email: user.email!,
          role: roleData.role as UserRole,
          clientId: roleData.client_id,
        });
      }
    } catch (error) {
      console.error('Error refreshing user role:', error);
    }
  }

  /**
   * Check if current user has a specific permission
   */
  function hasPermission(permission: Permission): boolean {
    if (!userRole) return false;
    return checkPermission(userRole.role, permission);
  }

  /**
   * Check if current user has access to a module
   */
  function hasModuleAccess(module: Module): boolean {
    if (!userRole) return false;
    return checkModuleAccess(userRole.role, module);
  }

  /**
   * Get all permissions for current user
   */
  function getPermissions(): Permission[] {
    if (!userRole) return [];
    return getRolePermissions(userRole.role);
  }

  /**
   * Get all accessible modules for current user
   */
  function getModules(): Module[] {
    if (!userRole) return [];
    return getRoleModules(userRole.role);
  }

  /**
   * Get role description and responsibilities
   */
  function getRoleDescription() {
    if (!userRole) return null;
    return ROLE_DESCRIPTIONS[userRole.role];
  }

  /**
   * Check if user is authenticated
   */
  function isAuthenticated(): boolean {
    return userRole !== null;
  }

  /**
   * Check if user has a specific role
   */
  function hasRole(role: UserRole): boolean {
    return userRole?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  function hasAnyRole(roles: UserRole[]): boolean {
    if (!userRole) return false;
    return roles.includes(userRole.role);
  }

  return {
    userRole,
    loading,
    hasPermission,
    hasModuleAccess,
    getPermissions,
    getModules,
    getRoleDescription,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    refresh: loadUserRole,
  };
}
