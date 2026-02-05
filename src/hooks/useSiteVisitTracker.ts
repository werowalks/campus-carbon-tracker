import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSiteVisitTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Generate a simple visitor ID for session tracking
        let visitorId = sessionStorage.getItem('visitor_id');
        if (!visitorId) {
          visitorId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          sessionStorage.setItem('visitor_id', visitorId);
        }

        // Track the visit
        await supabase.from('site_visits').insert({
          visitor_id: visitorId,
          page_path: window.location.pathname,
          user_agent: navigator.userAgent.substring(0, 500), // Limit length
        });
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.debug('Visit tracking failed:', error);
      }
    };

    // Track visit on mount (page load)
    trackVisit();
  }, []);
}

export default useSiteVisitTracker;