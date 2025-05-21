import fs from 'fs';
import { readYamlAsJson } from './lib/yaml-reader';
import { buildToolsFromApiConfigArray } from './lib/tools-builder';

const world = 'world';

export function hello(who: string = world): string {
  return `Hello ${who}! `;
}

const gretting = hello('Adolfo');

console.log(gretting);

const apiConfigArray = readYamlAsJson("apis.yaml").apis;
const tools = buildToolsFromApiConfigArray(apiConfigArray);

console.log(tools);

// guarda el resultado en un archivo JSON
fs.writeFileSync("tools.json", JSON.stringify(tools, null, 2), "utf8");
