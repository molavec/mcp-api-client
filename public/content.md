# MCP API Client Content

## Access settings

Add MCP to your agent config file. Example for `Claude Client` settings file:

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

## API Yaml setting

Check more about yaml config on [documentation](https://github.com/molavec/mcp-api-client)