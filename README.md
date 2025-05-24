# MCP API (BETA)

A Model Context Protocol (MCP) server that call APIs configured in YAML files. 

This server allows you call APIs using a config YAML file! 🤩

If you don't have **advance APIs call skills** using a programming language or you just want  **a fast way to connect your AI model with an API** using MCP, you will LOVE 💖 this MCP.

## Features

- Configure multiple API endpoints using YAML
- Supports all HTTP methods (GET, POST, PATCH, PUT, DELETE)
- Environment variable interpolation for sensitive data
- Automatic parameter generation from URL templates
- Factory pattern for tool creation
- Full MCP server implementation

## Use cases

- **Connect to N8N, Make.com or Zapier webhook**: Make actions in other platforms connecting to automations or integration tools.   
- **AI Model Integration**: Quickly connect LLMs or other AI models to external APIs for data retrieval, enrichment, or action execution without custom code.
- **Rapid Prototyping**: Build and test API workflows using YAML configuration, ideal for hackathons, demos, or proof-of-concept projects.
- **No-Code/Low-Code Automation**: Enable non-developers to define and call APIs securely using simple YAML files and environment variables.
- **Data Pipelines**: Orchestrate API calls as part of ETL or data processing pipelines, leveraging MCP tools for modularity and reuse.
- **API Gateway**: Expose multiple backend APIs through a unified MCP interface, simplifying integration for downstream consumers.
- **Secure API Access**: Manage secrets and tokens via environment variables, keeping sensitive data out of source code and YAML files.

## Installation

```bash
npx -y mcp-api path-to-api-config-file.yaml
```

## Get a api.yaml Example File

Create a `api.yaml` example File.

```bash
npx -y mcp-api --init
```


## Configuration api.yaml

Create an `api.yaml` file in your project:

```yaml
apis:
  - name: getUser
    url: https://api.example.com/users/{id}
    method: GET
    api-token: ${API_TOKEN}
    content:
      headers:
        Accept: application/json
  
  - name: createUser
    url: https://api.example.com/users
    method: POST
    api-token: ${API_TOKEN}
    content:
      headers:
        Content-Type: application/json
      body:
        name: string
        email: string
```

Create a `.env` file for your API tokens:

```
API_TOKEN=your_api_token_here
```

## Usage

Run the MCP server:

```bash
mcp-yaml-api
```

The server will create MCP tools for each API endpoint defined in your `api.yaml` file.

## YAML Configuration

Each API YAML file can include global metadata  with MCP information:

`metadata`: (optional) General information about the API set
  - `name`: The name of the API collection
  - `version`: The version of the configuration
  - `description`: A description of the API set

and a list of API endpoint definitions:

`apis`: A list of API endpoint definitions. Each endpoint should have:
  - `name`: The unique name for this API endpoint
    `description`: A short description of what this endpoint does
    `url`: The endpoint URL (supports path parameters like `{id}`)
    `method`: HTTP method (GET, POST, PATCH, PUT, DELETE)
    `api-token`: API token (supports environment variables)
    `content`: Request configuration
      `headers`: Request headers (key-value pairs)
      `query`: Query parameters (for GET or other methods, as a list of objects with name, type, default, required, description)
      `body`: Request body schema (for POST, PUT, PATCH, as a list of objects with name, type, default, required, description)

See `test/apis.yaml` for a complete example with metadata and all HTTP methods and parameter types.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
