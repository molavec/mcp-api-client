import { getUrlParametersAndQuerys, getBodyProperties } from "./parser.js";
import type { ApiBodyProperty } from "../types/api.js";


export const buildToolsFromApiConfigArray = (apiConfigArray: any[]): any[] =>
  apiConfigArray.map((apiConfig: any) => {
    // Get parameters and query from a url like http://localhost:3000/users/{id}?page={page}&limit={limit}
    const parametersAndQuerys = getUrlParametersAndQuerys(apiConfig.url);
    const method = apiConfig.method?.toUpperCase();
    const body: ApiBodyProperty[] | undefined = apiConfig.options?.body;
    const schema = getBodyProperties(body);

    const properties  = { ...parametersAndQuerys, ...schema }
    if(apiConfig.name === 'getUsers' ) {
      // console.error('parametersAndQuerys', parametersAndQuerys)
      // console.error('schema', getPropertiesFromSchema(schema))
      console.error('parametersAndQuerys', parametersAndQuerys)
      console.error('body', body)
      console.error('properties', properties)
    }

    return {
      name: apiConfig.name,
      description: apiConfig.description,
      inputSchema: {
        type: "object",
        properties: properties,
        required: (body || []).filter((p: ApiBodyProperty) => p.required).map((p: ApiBodyProperty) => p.name),
      },
      annotations: {
        title: apiConfig.description,
        readOnlyHint: method === "GET",
        destructiveHint: method === "DELETE",
        idempotentHint: method === "GET" || method === "DELETE",
        openWorldHint: true,
      },
    };
  });
