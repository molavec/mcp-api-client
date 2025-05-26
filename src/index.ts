#!/usr/bin/env node

import fs from 'fs';
import { readYamlAsJson } from './lib/yaml-reader.js';
import { McpServer } from "./lib/mcp.js";
import { createConfigFile } from './lib/create-config-file.js';
import { startMockServer } from './test/mock-api.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current file's directory
// to resolve relative paths correctly
// This is necessary because __dirname is not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const main = async () => {

  // If terminal has --version option print the version and exit
  if (process.argv.includes('--version')) {
    const packageJson = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'));
    console.log(`mcp-yaml-api version: ${packageJson.version}`);
    return;
  }

  // If terminal has --init option create a new config file based on the template public/apis.yaml and name it as api.yaml or the path given as argument
  if (process.argv.includes('--init')) {
    console.log("Creating config file...");
    const initIndex = process.argv.indexOf('--init');
    const outputConfigFile = process.argv[initIndex + 1] || 'apis.yaml';
    try {
      createConfigFile(outputConfigFile);
      console.log(`Config file created: ${outputConfigFile}`);
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
  const apiConfigFile = process.argv[2] || __dirname + '/../public/apis.yaml';
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
