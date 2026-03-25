'use client';

import { useRealtime } from '@/hooks/useRealtime';

export default function RealtimeProvider() {
  // Initiates the SSE connection and binds SWR invalidation on events
  useRealtime();
  
  return null; // This component doesn't render anything, it just maintains the SSE connection
}
