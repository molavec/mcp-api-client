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



