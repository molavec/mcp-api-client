import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current file's directory
// to resolve relative paths correctly
// This is necessary because __dirname is not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createConfigFile = (configFile: string) => {
  try {
    // Get this create-config-file.ts file directory
    const currentDir = __dirname;
    // Resolve the path to the template file
    const templateFile = `${currentDir}/../../public/apis.yaml`;
    // const templateFile = '/../../public/apis.yaml';
    const template = fs.readFileSync(templateFile, 'utf8');
    fs.writeFileSync(configFile, template, 'utf8');
  } catch (error) {
    throw error;
  }
};
