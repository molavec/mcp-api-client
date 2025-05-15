# MCP YAML API

A Model Context Protocol (MCP) server that creates tools from API configurations defined in YAML files. This server allows you to create MCP tools by simply defining API endpoints in a YAML configuration file, making it easy to integrate external APIs into your MCP ecosystem.

## Features

- Configure multiple API endpoints using YAML
- Supports all HTTP methods (GET, POST, PATCH, PUT, DELETE)
- Environment variable interpolation for sensitive data
- Automatic parameter generation from URL templates
- Factory pattern for tool creation
- Full MCP server implementation

## Installation

```bash
npm install -g mcp-yaml-api
```

## Configuration

Create an `api.yaml` file in your project:

```yaml
apis:
  getUser:
    url: https://api.example.com/users/{id}
    method: GET
    api-token: ${API_TOKEN}
    content:
      headers:
        Accept: application/json
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

Each API endpoint in the YAML file should have:

- `url`: The endpoint URL (supports path parameters like `{id}`)
- `method`: HTTP method (GET, POST, PATCH, PUT, DELETE)
- `api-token`: API token (supports environment variables)
- `content`: Request configuration
  - `headers`: Request headers
  - `body`: Request body schema (for POST, PUT, PATCH)

## Example Configuration

See `api.yaml` for a complete example with all HTTP methods.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
