import { Server } from '@modelcontextprotocol/sdk/server/index.js';

import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// import fs from 'fs';
import { readYamlAsJson } from './lib/yaml-reader';
import { buildToolsFromApiConfigArray } from './lib/tools-builder';
 
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
  const tool = tools.find(t => t.name === request.params.name);
  console.error("Tool:", tool.name);
  if (!tool) {
    throw new Error(`Tool ${request.params.name} not found`);
  }

  // obtiene la configuración del api desde el config.apis que tiene el mismo tool.name
  const apiConfig = config.apis.find((api: ApiConfig) => api.name === tool.name);
  if (!apiConfig) {
    throw new Error(`API configuration for tool ${tool.name} not found`);
  }

  // llama a un Factory para ejecutar la llamada a la API
  const factory = new ApiFactory(apiConfig);
  const response = await factory.callApi(request.params.input);
  console.error("Response:", response);
  // Aquí puedes procesar la respuesta de la API y devolverla al cliente

  // const textReturned = JSON.stringify(request,null,2);
  
  const textReturned = 'A message from the tool';

  return {
    content: [
      {
        type: 'text',
        text: textReturned,
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
