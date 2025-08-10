import { getV2EXBackend } from '../../../lib/v2ex-backend';

export const runtime = 'edge';

export default async function handler(request: Request) {
  // Get the address from URL
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const address = pathParts[pathParts.length - 1];

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!address) {
    return new Response(JSON.stringify({ error: 'Invalid address parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const backend = getV2EXBackend();
    const balance = await backend.getV2EXBalance(address);

    return new Response(JSON.stringify({ balance }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}