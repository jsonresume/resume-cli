import { readFile as readFileCB } from 'fs';
import { promisify } from 'util';

const readFile = promisify(readFileCB);

export default async ({ path: pathArg } = {}) => {
  let path = pathArg;
  if (!path) {
    path = require.resolve('resume-schema/schema.json');
  }
  return JSON.parse(
    await readFile(path, {
      encoding: 'utf-8',
    }),
  );
};
