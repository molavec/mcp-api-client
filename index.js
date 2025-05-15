import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Create a new server instance
const server = new McpServer({
  name: "My Model Context Protocol Server",
  version: "1.0.0",
  // The port to listen on
  // port: 3000,
  // The path to the directory containing the model files
  // modelsPath: "./models",
});

