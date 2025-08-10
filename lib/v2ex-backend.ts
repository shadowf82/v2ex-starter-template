import { V2EXBackend } from '../src/be/index';
import { config } from './config';

// Create a singleton instance for server-side usage
let backendInstance: V2EXBackend | null = null;

export function getV2EXBackend(): V2EXBackend {
  if (!backendInstance) {
    backendInstance = new V2EXBackend(
      config.server.rpcUrl,
      config.server.tokenAddress
    );
  }
  return backendInstance;
}

export default getV2EXBackend;