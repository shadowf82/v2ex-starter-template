import { getV2EXBackend } from '../../lib/v2ex-backend';

export const runtime = 'edge';

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { message, signature, publicKey } = body;
    
    if (!message || !signature || !publicKey) {
      return new Response(JSON.stringify({ error: 'Missing required fields: message, signature, publicKey' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const backend = getV2EXBackend();
    const isValid = await backend.verifySignature(message, signature, publicKey);

    return new Response(JSON.stringify({ 
      isValid
    }), {
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