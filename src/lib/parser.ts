import { z } from "zod";
import type { ApiBodyProperty } from "../types/api.js";
import { describe } from "node:test";

/**
 * Helper function to replace environment variables in a string
 * 
 * @param str - String containing environment variables in format ${VAR_NAME}
 * @returns String with environment variables replaced with their values
 */
const replaceEnvVars = (str: string): string => {
    return str.replace(/\${([^}]+)}/g, (_, varName) => process.env[varName] || "");
}

/**
 * Extracts path and query parameters from a URL template
 * 
 * @param url - URL template with parameters in format {paramName} and query params
 * @returns Object with parameter names as keys
 * 
 * @example
 * // URL with path parameter
 * getUrlParametersAndQuerys("/users/{id}") 
 * // Returns { id: string | number }
 * 
 * @example
 * // URL with query parameters
 * getUrlParametersAndQuerys("/users?page={page}&limit={limit}")
 * // Returns { page: string | number, limit: string | number }
 * 
 * @example
 * // URL with both path and query parameters
 * getUrlParametersAndQuerys("/users/{id}?page={page}&limit={limit}")
 * // Returns { id: string | number, page: string | number, limit: string | number }
 */
const getUrlParametersAndQuerys = (url: string): Record<string, any> => {
    const params: Record<string, any> = {};
    
    // Split URL into path and query
    const [path, query] = url.split('?');
    
    // Extract path parameters
    const pathMatches = path.match(/{([^}]+)}/g) || [];
    pathMatches.forEach(match => {
        const param = match.slice(1, -1); // Remove { and }
        params[param] = {type: "string"};
    });
    
    // Extract query parameters
    if (query) {
        const queryMatches = query.match(/{([^}]+)}/g) || [];
        queryMatches.forEach(match => {
            const param = match.slice(1, -1); // Remove { and }
            params[param] = {type: "string"};
        });
    }
    
    return params;
};

/**
 * Replaces dynamic parameters in a URL template with their corresponding values
 * 
 * @param url - URL template containing parameters in format {paramName}
 * @param params - Object containing the values to replace in the URL
 * @returns URL with all parameters replaced with their values
 * 
 * @example
 * // Basic usage
 * const url = "/api/users/{userId}";
 * const params = { userId: "123" };
 * replaceUrlParams(url, params); // Returns "/api/users/123"
 * 
 * @example
 * // Multiple parameters
 * const url = "/api/users/{userId}/posts/{postId}";
 * const params = { userId: "123", postId: "456" };
 * replaceUrlParams(url, params); // Returns "/api/users/123/posts/456"
 * 
 * @example
 * // Missing parameters
 * const url = "/api/users/{userId}";
 * const params = {};
 * replaceUrlParams(url, params); // Returns "/api/users/"
 */
const replaceUrlParams = (url: string, params: Record<string, string>): string => {
    return url.replace(/{([^}]+)}/g, (_, param) => params[param] || "");
}


const getBodyProperties = (bodyDef: ApiBodyProperty[] | undefined) => {
    if (!bodyDef || !Array.isArray(bodyDef)) return {};
    const schema: Record<string, any> = {};
    for (const prop of bodyDef) {
        schema[prop.name] = {
            type: prop.type,
            describe: prop.description,
        }
    }
    return schema;
}

// Function to create a Zod schema based on the body definition
const createBodySchema = (bodyDef: ApiBodyProperty[] | undefined) => {
    if (!bodyDef || !Array.isArray(bodyDef)) return z.object({}).optional();
    const schema: Record<string, any> = {};
    for (const prop of bodyDef) {
        let zodType;
        switch (prop.type.toLowerCase()) {
            case 'string':
                zodType = z.string();
                break;
            case 'number':
            case 'integer':
                zodType = z.number();
                break;
            case 'boolean':
                zodType = z.boolean();
                break;
            default:
                zodType = z.any();
        }
        
        // If required is true, the field is mandatory and the description message is added
        if (prop.required) {
            schema[prop.name] = zodType.describe(prop.description || '');
        } else {
            schema[prop.name] = zodType.optional();
        }

        // if default exists, the default value is added
        if (prop.default) {
            schema[prop.name] = schema[prop.name].default(prop.default);
        }
    }
    return schema;
}

const getPropertiesFromSchema = (schema: z.ZodTypeAny) => {
  if (schema instanceof z.ZodObject) {
    return schema.shape;
  }
  if (schema instanceof z.ZodOptional && schema._def.innerType instanceof z.ZodObject) {
    return schema._def.innerType.shape;
  }
  return {};
};


export {
    replaceEnvVars,
    getUrlParametersAndQuerys,
    replaceUrlParams,
    getBodyProperties,
    createBodySchema,
    getPropertiesFromSchema,
}