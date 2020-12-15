import fs from 'fs';
import { lookup } from 'mime-types';
import { resolve as resolvePath } from 'path';
import quaff from 'quaff';
import toString from 'stream-to-string';
import yaml from 'yaml-js';
import { promisify } from 'util';
import { not as stdinIsNotAPipe } from './utils/stdin-is-pipe';

const { createReadStream } = fs;
const stat = promisify(fs.stat);

const parsers = {
  'text/yaml': (string) => yaml.load(string),
  'application/json': (string) => JSON.parse(string),
};
export default async ({ path, mime: inputMime }) => {
  if (path && (await stat(path)).isDirectory()) {
    const quaffed = quaff(path);
    return quaffed;
  }
  let input;
  let mime;
  if ((await stdinIsNotAPipe()) && path) {
    mime = inputMime || lookup(path);
    input = createReadStream(resolvePath(process.cwd(), path));
  }
  if (!input) {
    mime = inputMime || lookup('.json');
    input = process.stdin;
  }
  const resumeString = await toString(input);
  const parser = parsers[mime];
  if (!parser) {
    throw new Error(`no parser available for detected mime type ${mime}`);
  }
  return parser(resumeString);
};
