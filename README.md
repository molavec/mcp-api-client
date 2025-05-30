# MCP API Client (Beta)

A **Model Context Protocol (MCP) server** that **call APIs** using **YAML config** files. 

This server allows you connect to APIs using simple a config YAML file! 🤩

Ideal for: **`#lazy-programmers`** **`#nocode`** **`#lowcode`** **`#ai-integrators`** **`#automation`** **`#api-gateway`** **`#data-pipelines`** **`#rapid-prototyping`** **`#llm-integration`** **`#makers`**

If you don't have **advance APIs call skills** using a programming language or you just want  **a fast way to connect your AI model with an API** using MCP, you will LOVE 💖 this MCP.

## Support

### YOU CAN HELP ME GET IT SOON!

Your help would really motivate me to get it done by **May 30th, 2025!** 

Make a reaction and give me a motivational comment on [mcp.so repository](https://mcp.so/server/mcp-api-client/molavec?tab=comments)

![Help me on mcp.so](./public/hack_help.png)


... and yes. A donation to help cover my coffee and rent would be amazing! 🙏🙏

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/G2G1FR7OO)

### Features

- Configure multiple API endpoints using YAML
- Automatic MCP tool creation from YAML config file.
- Automatic MCP fetch API creation from YAML config file.
- Supports all HTTP methods (GET, POST, PATCH, PUT, DELETE) [✨PARTIAL✨]
  - [✅] GET API without parameters
  - [✅] GET API with query parameters
  - [✅] GET API with path parameters
  - [✅] POST API
  - [✅] PATCH API with path parameters
  - [✅] PUT API with
  - [✅] DELETE API with path parameters
  -
- Set API Headers [✨WORKING✨]
- Set API Token [✨ 🫣🔴COMMING SOON✨]
- Environment variable interpolation for sensitive data [✨ 🫣🔴COMMING SOON✨]
- Automatic PATH parameter detection from URL (like `/users/{id}`)[✨WORKING✨]
- Automatic QUERY parameter detection from URL (like `/users?page={page}&limit={limit}`) [✨WORKING✨]
- ...and best of all, SAVE COUNTLESS HOURS FOR HUMANITY 👏😎😉 by connecting your LLM to any API.

### Use cases

- **Connect to N8N, Make.com or Zapier webhook**: Make actions in other platforms connecting to automations or integration tools.   
- **AI Model Integration**: Quickly connect LLMs or other AI models to external APIs for data retrieval, enrichment, or action execution without custom code.
- **Rapid Prototyping**: Build and test API workflows using YAML configuration, ideal for hackathons, demos, or proof-of-concept projects.
- **No-Code/Low-Code Automation**: Enable non-developers to define and call APIs securely using simple YAML files and environment variables.
- **Data Pipelines**: Orchestrate API calls as part of ETL or data processing pipelines, leveraging MCP tools for modularity and reuse.
- **API Gateway**: Expose multiple backend APIs through a unified MCP interface, simplifying integration for downstream consumers.
- **Secure API Access**: Manage secrets and tokens via environment variables, keeping sensitive data out of source code and YAML files.


<!-- ## How to use

```bash
npx -y mcp-api-client path-to-api-config-file.yaml
``` -->


## Getting started

1. Get a copy of default `api.yaml`.

```bash
npx -y mcp-api-client --init
```

2. You can test **default api.yaml** with express test server `test/server.js`. Execute in other terminal.

```bash
npx -y mcp-api-client --test-server
```

3. Add MCP to your agent config file. 

* Example for `Claude Client` settings file:

```json
"mcp": {
    "servers": {
      "mcp-api-client": {
          "command": "npx",
          "args": [
              "-y",
              "mcp-api-client",
              "path-to-api.yaml"
          ]
      },
    }
  }

```


* Example for `Visual Studio Code` settings file:

```json
"mcp": {
    "servers": {
      "mcp-api-client": {
          "command": "npx",
          "args": [
              "-y",
              "mcp-api-client",
              "path-to-api.yaml"
          ]
      },
    }
  }

```

4. Just Ask!

![Ask to Claude LLM in MCP client](./public/claude_client_example.png)



## YAML Configuration File

Each API YAML file can include global metadata  with MCP information:

```yaml
metadata: General information about the API set
  name: The name of the API collection
  version: The version of the configuration
  description: A description of the API set
```

and a list of API endpoint definitions:

```yaml
apis: A list of API endpoint definitions. Each endpoint should have
  - name: The unique name for this API endpoint
    description: A short description of what this endpoint does
    url: The endpoint URL (It does not supports path parameters like `{id} yet`)
    method: HTTP method (GET, POST, PATCH, PUT, DELETE)
    api-token: API token (supports environment variables)
    options: Request configuration
      headers: Request headers (key-value pairs)
      query: Query parameters (for GET or other methods, as a list of objects with name, type, default, required, description)
      body: Request body schema (for POST, PUT, PATCH, as a list of objects with name, type, default, required, description)
```

See `public/apis.yaml` for a complete example with metadata and all HTTP methods and parameter types.


## Config Example

```yaml
apis:
  - name: getUser
    url: https://api.example.com/users/{id}
    method: GET
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
  ...
```

<!-- 
## API_TOKEN from .env

Create a `.env` file for your API tokens:

```
API_TOKEN=your_api_token_here
``` -->


## TODO

* POST
* PUT
* PATCH
* DELETE
* headers
* API_TOKEN

## Bugs and Requests

https://github.com/molavec/mcp-api-client/issues

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
MIT
