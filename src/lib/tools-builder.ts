import { createBodySchema } from "./parser";
import type { ApiBodyProperty } from "../types/apiBodyProperty";
import { z } from "zod";

const getPropertiesFromSchema = (schema: z.ZodTypeAny) => {
  if (schema instanceof z.ZodObject) {
    return schema.shape;
  }
  if (schema instanceof z.ZodOptional && schema._def.innerType instanceof z.ZodObject) {
    return schema._def.innerType.shape;
  }
  return {};
};

export const buildToolsFromApiConfigArray = (apiConfigArray: any[]): any[] =>
  apiConfigArray.map((apiConfig: any) => {
    const method = apiConfig.method?.toUpperCase();
    const bodyDef: ApiBodyProperty[] | undefined = apiConfig.content?.body;
    const schema = createBodySchema(bodyDef);
    return {
      name: apiConfig.name,
      description: apiConfig.description,
      inputSchema: {
        type: "object",
        properties: getPropertiesFromSchema(schema),
        required: (bodyDef || []).filter((p: ApiBodyProperty) => p.required).map((p: ApiBodyProperty) => p.name),
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
