import { Server } from '@modelcontextprotocol/sdk/server/index.js';

import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// import fs from 'fs';
import { readYamlAsJson } from './lib/yaml-reader';
import { buildToolsFromApiConfigArray } from './lib/tools-builder';
import { callApi } from './lib/api-factory';
 
import type { ApiConfig } from './types/api';

// Lee el archivo YAML de configuración de las APIs y construye la lista de herramientas
const apiConfigFile = process.argv[2] || 'test/apis.yaml';
const config = readYamlAsJson(apiConfigFile);
const tools = buildToolsFromApiConfigArray(config.apis);

// Crea el servidor MCP
const server = new Server({
  name: config.metadata.name || 'mcp-yaml-api',
  description: config.metadata.description || 'MCP Yaml API',
  version: config.metadata.version ||'1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

// Registra las herramientas en el servidor
server.setRequestHandler(ListToolsRequestSchema, async () => { return { tools: tools } });

// Registra el manejador para la llamada a la herramienta
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  
  // Obtiene la herramienta
  const tool = tools.find(t => t.name === request.params.name);
  console.error("Tool:", tool.name);
  if (!tool) {
    throw new Error(`Tool ${request.params.name} not found`);
  }

  // obtiene la configuración del api con el mismo tool.name
  const apiConfig = config.apis.find((api: ApiConfig) => api.name === tool.name);
  if (!apiConfig) {
    throw new Error(`API configuration for tool ${tool.name} not found`);
  }

  const response = await callApi(apiConfig, request.params.arguments);
  console.error("Response:", response);

  // Devuelve la respuesta real de la API
  return {
    content: [
      {
        type: 'text',
        text: typeof response === 'string' ? response : JSON.stringify(response, null, 2),
      },
    ],
  };
});


async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP-YAML-API Server running on stdio.");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

// guarda el resultado en un archivo JSON
// fs.writeFileSync("tools.json", JSON.stringify(tools, null, 2), "utf8");
