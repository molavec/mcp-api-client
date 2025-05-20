import { Tool } from '@modelcontextprotocol/sdk';
import fetch from 'node-fetch';
import zod from 'zod';


function createBodySchema(bodyDef) {
    if (!bodyDef) return z.object({}).optional();

    const schema = {};
    for (const [key, type] of Object.entries(bodyDef)) {
        switch (type.toLowerCase()) {
            case 'string':
                schema[key] = z.string();
                break;
            case 'number':
                schema[key] = z.number();
                break;
            case 'boolean':
                schema[key] = z.boolean();
                break;
            default:
                schema[key] = z.any();
        }
    }
    return z.object(schema);
}

export class ApiToolFactory {
  static createTool(name, config) {
    const { url, method, api_token, content } = config;

    return new Tool({
      name,
      description: `Makes a ${method} request to ${url}`,
      parameters: {
        type: 'object',
        properties: {
          ...this.generateParameters(url),
          ...(content.body ? { body: createBodySchema(content.body)} : {})
        },
        required: this.extractRequiredParams(url)
      },
      execute: async (params) => {
        try {
          const resolvedUrl = this.resolveUrl(url, params);
          const headers = {
            ...(content.headers || {}),
            'Authorization': `Bearer ${process.env[api_token.replace('${', '').replace('}', '')] || api_token}`
          };

          const response = await fetch(resolvedUrl, {
            method,
            headers,
            ...(content.body ? { body: JSON.stringify(params.body) } : {})
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          return { status: 'success', data };
        } catch (error) {
          return { status: 'error', error: error.message };
        }
      }
    });
  }

  static generateParameters(url) {
    const params = {};
    const urlParams = url.match(/{([^}]+)}/g) || [];
    
    urlParams.forEach(param => {
      const paramName = param.replace(/{|}/g, '');
      params[paramName] = { type: 'string' };
    });

    return params;
  }

  static extractRequiredParams(url) {
    return (url.match(/{([^}]+)}/g) || [])
      .map(param => param.replace(/{|}/g, ''));
  }

  static resolveUrl(url, params) {
    let resolvedUrl = url;
    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'body') {
        resolvedUrl = resolvedUrl.replace(`{${key}}`, value);
      }
    });
    return resolvedUrl;
  }
}
