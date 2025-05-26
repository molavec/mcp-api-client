import fs from 'fs';

export const createConfigFile = (configFile: string) => {
  try {
    // Get this create-config-file.ts file directory
    const currentDir = __dirname;
    // Resolve the path to the template file
    const templateFile = `${currentDir}/../test/apis.yaml`;
    // const templateFile = './src/test/apis.yaml';
    const template = fs.readFileSync(templateFile, 'utf8');
    fs.writeFileSync(configFile, template, 'utf8');
  } catch (error) {
    throw error;
  }
};
