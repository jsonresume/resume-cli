import fs from 'fs';
import { lookup } from 'mime-types';
import { resolve as resolvePath } from 'path';
import quaff from 'quaff';
import toString from 'stream-to-string';
import yaml from 'yaml-js';
import { promisify } from 'util';

const { createReadStream } = fs;
const stat = promisify(fs.stat);

const parsers = {
  'text/yaml': (string) => yaml.load(string),
  'application/json': (string) => JSON.parse(string),
};
export default async ({ path, mime }) => {
  let input;
  if ('-' === path) {
    mime = mime || lookup('.json');
    input = process.stdin;
  } else if (path && (await stat(path)).isDirectory()) {
    return quaff(path);
  }
  if (!input) {
    mime = mime || lookup(path);
    input = createReadStream(resolvePath(process.cwd(), path));
  }
  if (!input) {
    throw new Error('resume could not be gotten from path or stdin');
  }
  const resumeString = await toString(input);
  const parser = parsers[mime];
  if (!parser) {
    throw new Error(`no parser available for detected mime type ${mime}`);
  }
  return parser(resumeString);
};
