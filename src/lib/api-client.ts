import type { ApiConfig } from '../types/api.js';

export class ApiClient {
  constructor() {
    // Sin estado ni configuración global
  }

  async callApi(apiConfig: ApiConfig, args?: Record<string, any>): Promise<any> {
    const { url, method, options } = apiConfig;

    let endpoint = url;
    let headers: Record<string, string> = {};
    let body: Record<string, any> = {};

    // Interpolación de path & query params
    if (endpoint && args) {
      endpoint = endpoint.replace(/\{(\w+)\}/g, (_: string, key: string) => args[key] ?? `{${key}}`);
    }

    // Headers
    if (options?.headers) {
      for (const [k, v] of Object.entries(options.headers)) {
        headers[k] = String(v);
      }
    }
    // API Token
    if ('api-token' in apiConfig && apiConfig['api-token']) {
      headers['Authorization'] = `Bearer ${process.env.API_TOKEN || ''}`;
    }

    // Body
    if (options?.body) {
      for (const b of options.body) {
        if (args && args[b.name] !== undefined) {
          body[b.name] = args[b.name];
        } else if (b.default !== undefined) {
          body[b.name] = b.default;
        }
      }
    }

    const fetchOptions: RequestInit = {
      method: method,
      headers,
    };
    
    if (["POST", "PUT", "PATCH"].includes((method || '').toUpperCase())) {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(endpoint, fetchOptions);
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error: any) {
      return { error: error.message };
    }
  }
}
