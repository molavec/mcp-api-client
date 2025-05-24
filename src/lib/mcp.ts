import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildToolsFromApiConfigArray } from './tools-builder';
import { ApiClient } from './api-client';
import type { ApiConfig } from '../types/api';
import type { McpMetadata } from '../types/mcp';

export class McpServer {
  private metadata: McpMetadata;
  private apis: ApiConfig[];
  private tools: any[];
  private server: any;

  constructor(metadata: McpMetadata, apis: ApiConfig[]) {
    this.metadata = metadata;
    this.apis = apis;
    this.tools = buildToolsFromApiConfigArray(this.apis);
    this.server = new Server({
      name: this.metadata.name || 'mcp-yaml-api',
      description: this.metadata.description || 'MCP Yaml API',
      version: this.metadata.version || '1.0.0'
    }, {
      capabilities: {
        tools: {}
      }
    });
    this.registerListToolsHandler();
    this.registerCallToolHandler();
  }

  private registerListToolsHandler() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return { tools: this.tools };
    });
  }

  private registerCallToolHandler() {
    const apiClient = new ApiClient();
    this.server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      
      const tool = this.tools.find(t => t.name === request.params.name)
      if (!tool) { throw new Error(`Tool ${request.params.name} not found`) }

      const apiConfig = this.apis.find((api: ApiConfig) => api.name === tool.name)
      if (!apiConfig) { throw new Error(`API configuration for tool ${tool.name} not found`)}
      
      const response = await apiClient.callApi(apiConfig, request.params.arguments);
      console.error("Response:", response);
      
      return {
        content: [
          {
            type: 'text',
            text: typeof response === 'string' ? response : JSON.stringify(response, null, 2),
          },
        ],
      };
    });
  }

  async runServer() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("MCP-YAML-API Server running on stdio.");
  }
}

