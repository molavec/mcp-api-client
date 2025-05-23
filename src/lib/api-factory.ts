import type { ApiConfig } from '../../types/api';
import axios, { AxiosRequestConfig } from 'axios';

export class ApiFactory {
  private apiConfig: ApiConfig;

  constructor(apiConfig: ApiConfig) {
    this.apiConfig = apiConfig;
  }

  async callApi(input: Record<string, any>): Promise<any> {
    const { url, method, content } = this.apiConfig;
    let endpoint = url;
    let data: any = {};
    let params: any = {};
    let headers: any = {};

    // Interpolación de path params
    if (endpoint && input) {
      endpoint = endpoint.replace(/\{(\w+)\}/g, (_, key) => input[key] ?? `{${key}}`);
    }

    // Headers
    if (content?.headers) {
      for (const [k, v] of Object.entries(content.headers)) {
        headers[k] = v;
      }
    }
    // API Token
    if (this.apiConfig['api-token']) {
      headers['Authorization'] = `Bearer ${process.env.API_TOKEN || ''}`;
    }

    // Query params
    if (content?.query) {
      for (const q of content.query) {
        if (input[q.name] !== undefined) {
          params[q.name] = input[q.name];
        } else if (q.default !== undefined) {
          params[q.name] = q.default;
        }
      }
    }

    // Body
    if (content?.body) {
      for (const b of content.body) {
        if (input[b.name] !== undefined) {
          data[b.name] = input[b.name];
        } else if (b.default !== undefined) {
          data[b.name] = b.default;
        }
      }
    }

    const config: AxiosRequestConfig = {
      url: endpoint,
      method: method?.toLowerCase() as any,
      headers,
      params,
      data: Object.keys(data).length > 0 ? data : undefined,
      validateStatus: () => true,
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error: any) {
      return { error: error.message };
    }
  }
}
