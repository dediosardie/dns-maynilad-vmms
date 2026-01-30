import { useState, useEffect } from 'react';
import { pageRestrictionService } from '../services/pageRestrictionService';
import { useRoleAccess } from './useRoleAccess';

/**
 * Hook to check page access based on database page restrictions
 */
export function usePageAccess() {
  const { userRole } = useRoleAccess();
  const [pageAccessMap, setPageAccessMap] = useState<Map<string, boolean>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPageAccess() {
      if (!userRole) {
        setLoading(false);
        return;
      }

      // Set loading to true when refetching (e.g., role change)
      setLoading(true);

      try {
        const accessiblePages = await pageRestrictionService.getAccessiblePagesByRole(userRole.role);
        const accessMap = new Map<string, boolean>();
        
        console.log('🔍 [usePageAccess] Loading page access for role:', userRole.role);
        console.log('🔍 [usePageAccess] Accessible pages from database:', accessiblePages);
        
        // Mark all accessible pages
        accessiblePages.forEach(page => {
          accessMap.set(page.page_path, true);
          console.log(`✓ [usePageAccess] Added page: ${page.page_path} (${page.page_name})`);
        });

        console.log('🔍 [usePageAccess] Final access map:', Array.from(accessMap.entries()));
        setPageAccessMap(accessMap);
      } catch (error) {
        console.error('Error loading page access:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPageAccess();
  }, [userRole]);

  /**
   * Check if user has access to a specific page path
   * PRIMARY ACCESS CONTROL - page_restrictions table is authoritative
   */
  function hasPageAccess(pagePath: string): boolean {
    // Still loading page access OR role data - allow access temporarily
    // ProtectedRoute will handle the actual loading state display
    // This prevents flash of AccessDenied during initial load or page transitions
    if (loading || !userRole) {
      console.log(`🔍 [hasPageAccess] Still loading, allowing temporary access for: ${pagePath}`);
      return true;
    }
    
    // No restrictions configured - allow access to dashboard only
    // Admin must configure page_restrictions for other pages
    if (pageAccessMap.size === 0) {
      console.warn('⚠️ No page restrictions configured in database.');
      console.log(`🔍 [hasPageAccess] No restrictions, allowing only /dashboard. Checking: ${pagePath}`);
      // Allow only dashboard when no restrictions exist
      return pagePath === '/dashboard';
    }
    
    // Check if page is explicitly allowed in database
    const hasAccess = pageAccessMap.get(pagePath);
    
    console.log(`🔍 [hasPageAccess] Checking path: ${pagePath}, result: ${hasAccess}, map size: ${pageAccessMap.size}`);
    
    // If page not in database, deny access (fail-closed)
    if (hasAccess === undefined) {
      console.warn(`⚠️ Page "${pagePath}" not found in page_restrictions. Access denied.`);
      console.log(`🔍 [hasPageAccess] Available paths:`, Array.from(pageAccessMap.keys()));
      return false;
    }
    
    return hasAccess === true;
  }

  /**
   * Get all accessible page paths
   */
  function getAccessiblePages(): string[] {
    return Array.from(pageAccessMap.keys());
  }

  return {
    hasPageAccess,
    getAccessiblePages,
    loading,
  };
}
