import fs from 'fs';

export const createConfigFile = (configFile: string) => {
  try {
    const templateFile = './src/test/apis.yaml';
    const template = fs.readFileSync(templateFile, 'utf8');
    fs.writeFileSync(configFile, template, 'utf8');
  } catch (error) {
    throw error;
  }
};
