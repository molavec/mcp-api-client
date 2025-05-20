import { z } from "zod";
import type { ApiBodyProperty } from "../types/apiBodyProperty";

// Función auxiliar para reemplazar variables de entorno
function replaceEnvVars(str: string): string {
    return str.replace(/\${([^}]+)}/g, (_, varName) => process.env[varName] || "");
}

// Función auxiliar para reemplazar parámetros en la URL
function replaceUrlParams(url: string, params: Record<string, string>): string {
    return url.replace(/{([^}]+)}/g, (_, param) => params[param] || "");
}

// Función para crear un esquema Zod basado en la definición del body
function createBodySchema(bodyDef: ApiBodyProperty[] | undefined) {
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
        
        // Si required es true, el campo es obligatorio y se añade el mensaje de descripción
        if (prop.required) {
            schema[prop.name] = zodType.describe(prop.description || '');
        } else {
            schema[prop.name] = zodType.optional();
        }

        // si default existe se añade el valor por defecto
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