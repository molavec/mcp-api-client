// Template para la creación de MCP Servers
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Puedes cambiar el tipo de transporte según necesites:
// - StdioServerTransport: Para comunicación mediante stdin/stdout
// - HttpServerTransport: Para comunicación mediante HTTP
// - WebSocketServerTransport: Para comunicación mediante WebSocket

const mcpServer = new McpServer({
    name: "my-mcp-server",           // Cambia esto por el nombre de tu servidor
    description: "Description of what your MCP server does", // Agrega una descripción apropiada
    version: "1.0.0",               // Versión de tu servidor
});

// Ejemplo de una herramienta simple
mcpServer.tool(
    "tool_name",                    // Nombre de la herramienta
    "Tool description",             // Descripción de la herramienta
    {
        // Define los parámetros de entrada usando Zod
        param1: z.string().describe("Description of parameter 1"),
        param2: z.number().optional().describe("Optional parameter 2"),
        // Puedes agregar más parámetros según necesites
    },
    async ({ param1, param2 }) => {
        try {
            // Implementa aquí la lógica de tu herramienta
            const result = `Processed ${param1}`;

            return {
                content: [
                    {
                        type: "text",
                        text: result,
                    },
                    // También puedes devolver otros tipos de contenido como:
                    // { type: "image", base64: "..." }
                    // { type: "file", path: "..." }
                ],
            };
        } catch (error) {
            // Manejo de errores
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${error.message}`,
                    },
                ],
            };
        }
    },
);

// Ejemplo de una herramienta más compleja con procesamiento asíncrono
mcpServer.tool(
    "async_tool",
    "Asynchronous tool example",
    {
        inputData: z.string().describe("Input data to process"),
    },
    async ({ inputData }) => {
        return new Promise((resolve, reject) => {
            try {
                // Implementa aquí tu lógica asíncrona
                setTimeout(() => {
                    resolve({
                        content: [
                            {
                                type: "text",
                                text: `Processed async: ${inputData}`,
                            },
                        ],
                    });
                }, 1000);
            } catch (error) {
                resolve({
                    content: [
                        {
                            type: "text",
                            text: `Error: ${error.message}`,
                        },
                    ],
                });
            }
        });
    },
);

// Inicialización del servidor
const transport = new StdioServerTransport();
// También puedes usar otros transportes como:
// const transport = new HttpServerTransport({ port: 3000 });
// const transport = new WebSocketServerTransport({ port: 8080 });

await mcpServer.connect(transport);
