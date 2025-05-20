import fs from 'fs';
import yaml from 'yaml';

/**
 * Reads a YAML file and returns its contents as a JSON object.
 * @param filePath Path to the YAML file.
 * @returns Parsed JSON object.
 */
export function readYamlAsJson(filePath: string): any {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.parse(fileContents);
    return data;
  } catch (e) {
    throw new Error(`Error reading YAML file: ${e}`);
  }
}

const apiConfigArray = readYamlAsJson("apis.yaml").apis;

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

const tools = apiConfigArray.map((apiConfig: any) => {
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



export { tools };



