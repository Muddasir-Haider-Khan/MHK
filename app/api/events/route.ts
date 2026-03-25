import { sseEmitter } from '@/lib/sse';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Create listener
      const listener = (data: any) => {
        try {
          // SSE format: data: JSON_STRING \n\n
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch (e) {
          console.error("SSE encoding error", e);
        }
      };

      // Subscribe to global emitter
      sseEmitter.on('broadcast', listener);

      // Send initial connected event to client
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'connected', timestamp: new Date().toISOString() })}\n\n`));

      // Keep connection alive every 30s to prevent Vercel/Cloudflare from dropping it
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': keepalive\n\n'));
        } catch (e) {
          clearInterval(keepAlive);
        }
      }, 30000);

      // Clean up when client disconnects
      req.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
        sseEmitter.off('broadcast', listener);
        try { controller.close(); } catch {}
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      // Allow CORS if needed
      'Access-Control-Allow-Origin': '*'
    },
  });
}
