# **Project Requirements Document: The Urlist Website**

The following table outlines the detailed functional requirements of The Urlist website.

| Requirement ID | Description               | User Story                                                                                       | Expected Behavior/Outcome                                                                                                     |
|-------|---------------------------|--------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| FR001 | Create a MCP to fetch an API defined in yaml file   | As a user, I want to be set up a yaml file with parameters to fetch an API.  | The proyect should have a yaml file with parameters to configure a fetch API Call. |
| FR002 | yaml example should have many API calls   | As a user, I want to be set up multiple APIs   | The apis.yaml example file should have a at least 5 API config examples GET, POST, PATCH, PUT, DELETE  |
| FR003 | yaml API config example should have url field   | As a user, I want to be set up the API url   | The yaml example file should have the url in the APIs Config |
| FR004 | yaml API config example should have method field   | As a user, I want to be set up the API method   | The yaml example file should have the method in the APIs Config |
| FR005 | yaml API config example should have api-token field   | As a user, I want to be set up the API api-token   | The yaml example file should have the api-token in the APIs Config |
| FR006 | yaml API config example should have content field   | As a user, I want to be set up the API content   | The yaml example file should have the content in the APIs Config |
| FR007 | The script should read yaml config file    | As a user, I want the MCP Server should read the config file   | the app should read yaml config file |
| FR008 | The app should create an instance of McpServer  | As a user, I want the MCP Server should raise a MCP server   | the app should raise a MCP Server instance |
| FR009 | The MCP server should create a instance using factoring pattern design  | As a user, I want the MCP Server encharges to deal with api fetch creation   | the app should raise create tools |
| FR010 | The MCP server should create a tool por every API defined in apis.yaml  | As a user, I want the MCP Server request API defined in apis.yaml   | the app should fetch apis defined in yaml file |


