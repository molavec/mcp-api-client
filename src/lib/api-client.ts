import type { ApiConfig } from '../types/api.js';

export class ApiClient {
  constructor() {
    // Sin estado ni configuración global
  }

  async callApi(apiConfig: ApiConfig, args?: Record<string, any>): Promise<any> {
    const { url, method, content } = apiConfig;

    let endpoint = url;
    let headers: Record<string, string> = {};
    let query: Record<string, any> = {};
    let body: Record<string, any> = {};

    // Interpolación de path params
    if (endpoint && args) {
      endpoint = endpoint.replace(/\{(\w+)\}/g, (_: string, key: string) => args[key] ?? `{${key}}`);
    }

    // Headers
    if (content?.headers) {
      for (const [k, v] of Object.entries(content.headers)) {
        headers[k] = String(v);
      }
    }
    // API Token
    if ('api-token' in apiConfig && apiConfig['api-token']) {
      headers['Authorization'] = `Bearer ${process.env.API_TOKEN || ''}`;
    }

    // Query params
    if (content?.query) {
      for (const q of content.query) {
        if (args && args[q.name] !== undefined) {
          query[q.name] = args[q.name];
        } else if (q.default !== undefined) {
          query[q.name] = q.default;
        }
      }
    }

    // Body
    if (content?.body) {
      for (const b of content.body) {
        if (args && args[b.name] !== undefined) {
          body[b.name] = args[b.name];
        } else if (b.default !== undefined) {
          body[b.name] = b.default;
        }
      }
    }

    // Builds the query string
    let urlWithQuery = endpoint;
    const queryString = Object.keys(query)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]))
      .join('&');
    if (queryString) {
      urlWithQuery += (urlWithQuery.includes('?') ? '&' : '?') + queryString;
    }

    const fetchOptions: RequestInit = {
      method: method,
      headers,
    };
    if (["POST", "PUT", "PATCH"].includes((method || '').toUpperCase())) {
      fetchOptions.body = JSON.stringify(body);
    }

    // No loggear información sensible
    // console.error("URL:", urlWithQuery);
    // console.error("Fetch Options:", fetchOptions);

    try {
      const response = await fetch(urlWithQuery, fetchOptions);
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
