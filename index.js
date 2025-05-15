#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk';
import { ApiToolFactory } from './lib/api-tool-factory.js';
import YAML from 'yaml';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

async function main() {
  try {
    // Read and parse YAML config file
    const configPath = path.join(process.cwd(), 'api.yaml');
    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = YAML.parse(configFile);

    // Create MCP server
    const server = new Server();

    // Create tools from config
    if (Array.isArray(config.apis)) {
      config.apis.forEach(apiConfig => {
        const { name, ...toolConfig } = apiConfig;
        const tool = ApiToolFactory.createTool(name, toolConfig);
        server.addTool(tool);
      });
    } else {
      throw new Error('APIs configuration must be an array');
    }

    // Start the server
    await server.start();
    console.log('MCP server is running...');
  } catch (error) {
    console.error('Error starting MCP server:', error);
    process.exit(1);
  }
}

main();

