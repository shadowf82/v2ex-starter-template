import { getV2EXBackend } from '../../../lib/v2ex-backend';

export const runtime = 'edge';

export default async function handler(request: Request) {
  // Get the signature from URL
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const signature = pathParts[pathParts.length - 1];

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!signature) {
    return new Response(JSON.stringify({ error: 'Invalid signature parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const backend = getV2EXBackend();
    const transaction = await backend.getTransactionDetails(signature);

    if (!transaction) {
      return new Response(JSON.stringify({ error: 'Transaction not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ transaction }), {
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