import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Server } from '@modelcontextprotocol/sdk';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ApiToolFactory } from '../lib/api-tool-factory.js';
import { startMockServer } from './mock-api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('MCP YAML API', () => {
  let config;
  let server;
  let mockServer;

  beforeAll(async () => {
    // Start mock server
    mockServer = await startMockServer();

    // Use test configuration
    const configPath = path.join(__dirname, 'test-api.yaml');
    const configFile = fs.readFileSync(configPath, 'utf8');
    config = YAML.parse(configFile);

    // Create MCP server
    server = new Server();

    // Add tools from config
    if (Array.isArray(config.apis)) {
      config.apis.forEach(apiConfig => {
        const { name, ...toolConfig } = apiConfig;
        const tool = ApiToolFactory.createTool(name, toolConfig);
        server.addTool(tool);
      });
    }
  });

  afterAll(async () => {
    // Close mock server
    if (mockServer) {
      await new Promise((resolve) => mockServer.close(resolve));
    }
  });

  it('should parse YAML config correctly', () => {
    expect(config).toBeDefined();
    expect(config.apis).toBeDefined();
    expect(Array.isArray(config.apis)).toBe(true);
    expect(config.apis.length).toBeGreaterThan(0);
  });

  it('should have required fields in API configurations', () => {
    for (const api of config.apis) {
      expect(api).toHaveProperty('name');
      expect(api).toHaveProperty('url');
      expect(api).toHaveProperty('method');
      expect(api).toHaveProperty('api-token');
      expect(api).toHaveProperty('content');
    }
  });

  it('should create MCP tools for each API endpoint', () => {
    const tools = server.listTools();
    expect(tools.length).toBe(config.apis.length);
  });
});
