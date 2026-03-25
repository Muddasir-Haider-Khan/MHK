'use client';

import { useEffect } from 'react';
import { useSWRConfig } from 'swr';

export function useRealtime() {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    // Connect to the Server-Sent Events endpoint
    const eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        
        if (payload.event === 'content_updated') {
          console.log('[Realtime Sync] Content updated:', payload.payload);
          const { type, action, data } = payload.payload;
          
          // Dynamically invalidate SWR caches based on what content changed in admin
          switch (type) {
            case 'hero':
              // Invalidate specific page hero or all heroes
              mutate(data?.page_slug ? `/api/hero/${data.page_slug}` : (key: string) => typeof key === 'string' && key.startsWith('/api/hero/'));
              break;
            case 'settings':
              mutate('/api/site-settings');
              break;
            case 'nav':
              mutate('/api/nav');
              break;
            case 'testimonials':
            case 'announcement':
            case 'team':
            case 'pricing':
            case 'faq':
            case 'gallery':
            case 'stats':
              // Generic fallback — invalidate the list endpoint
              mutate(`/api/${type}`);
              break;
            case 'page':
              mutate(data?.slug ? `/api/pages/${data.slug}` : (key: string) => typeof key === 'string' && key.startsWith('/api/pages/'));
              break;
            case 'post':
              mutate('/api/posts');
              if (data?.slug) mutate(`/api/posts/${data.slug}`);
              break;
          }
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE Error:', err);
      // EventSource auto-reconnects, but we log the error for debugging
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, [mutate]);
}
