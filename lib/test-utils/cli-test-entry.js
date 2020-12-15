import build from './mocked-volume-builder';
import { patchFs } from 'fs-monkey';
import { ufs } from 'unionfs';
import * as fs from 'fs';

const vol = ufs.use(build({ mount: '/test-resumes' })).use(fs);
patchFs(vol);
require('../main.js');
