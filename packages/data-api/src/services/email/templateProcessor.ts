import * as _ from 'lodash';
import mjml2html from 'mjml';
import * as fs from 'fs';
import * as path from 'path';

interface Templates {
  'reset-password'?: string;
}

// Moustashe {{}} syntax
const interpolate = /{{([\s\S]+?)}}/g;

let templates: Templates | undefined;

// Load and cache the compiled templates
const loadTemplates = async () => {
  const dirName = path.join(__dirname, './templates');
  const filenames = await fs.promises.readdir(dirName);
  const res: Templates = {};

  await Promise.all(
    filenames.map(async filename => {
      const mjmsTemplate = (
        await fs.promises.readFile(path.join(dirName, filename))
      ).toString('utf-8');

      const mjmlOutput = mjml2html(mjmsTemplate);
      if (mjmlOutput.errors.length) {
        throw new Error(mjmlOutput.errors[0].formattedMessage);
      }

      // remove extension
      res[filename.split('.')[0] as keyof Templates] = mjmlOutput.html;
    }),
  );

  return res;
};

export const getEmailTemplate = async (
  templateName: keyof Templates,
  data: any,
) => {
  if (!templates) {
    templates = await loadTemplates();
  }

  if (!templates[templateName]) {
    throw new Error(`${templateName} template not found.`);
  }

  const executeTemplate = _.template(templates[templateName], {
    interpolate,
  });

  return executeTemplate(data);
};
