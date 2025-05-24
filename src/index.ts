#!/usr/bin/env node

import fs from 'fs';
import { readYamlAsJson } from './lib/yaml-reader.js';
import { McpServer } from "./lib/mcp.js";
import { createConfigFile } from './lib/create-config-file.js';
import { startMockServer } from './test/mock-api.js';


const main = async () => {
  // If terminal has --init option create a new config file based on the template test/apis.yaml and name it as api.yaml or the path given as argument
  if (process.argv.includes('--init')) {
    console.log("Creating config file...");
    const initIndex = process.argv.indexOf('--init');
    const configFile = process.argv[initIndex + 1] || 'apis.yaml';
    try {
      createConfigFile(configFile);
      console.log(`Config file created: ${configFile}`);
    } catch (error) {
      console.error('Error creating config file:', error);
    }
    return;
  }

  //is terminal has --test-server execute startMockServer()
  if (process.argv.includes('--test-server')) {
    console.log("Starting mock server...");
    await startMockServer();
    return;
  }

  // Reads the YAML file with the API configuration and builds the tools list
  const apiConfigFile = process.argv[2] || './src/test/apis.yaml';
  const config = readYamlAsJson(apiConfigFile);

  const mcpServer = new McpServer(config.metadata, config.apis);

  mcpServer.runServer().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
  });

};


main().catch((error) => { 
  console.error("Fatal error in main():", error);
  process.exit(1);
}
);
