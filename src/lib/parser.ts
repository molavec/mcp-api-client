import { z } from "zod";
import type { ApiProperty } from "../types/api";

// Helper function to replace environment variables
function replaceEnvVars(str: string): string {
    return str.replace(/\${([^}]+)}/g, (_, varName) => process.env[varName] || "");
}

// Helper function to replace parameters in the URL
function replaceUrlParams(url: string, params: Record<string, string>): string {
    return url.replace(/{([^}]+)}/g, (_, param) => params[param] || "");
}

// Function to create a Zod schema based on the body definition
function createBodySchema(bodyDef: ApiProperty[] | undefined) {
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
    return z.object(schema);
}

export {
    replaceEnvVars,
    replaceUrlParams,
    createBodySchema
}