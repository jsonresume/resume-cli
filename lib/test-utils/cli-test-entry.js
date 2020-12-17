import build from './mocked-volume-builder';
import { patchFs } from 'fs-monkey';
import { ufs } from 'unionfs';
import * as fs from 'fs';

const mockVolume = build({ mount: '/test-resumes' });
const vol = ufs.use(mockVolume).use(fs);
patchFs(vol);
require('../main.js');
process.once('beforeExit', () => {
  process.send({ data: mockVolume.toJSON(), type: 'volumeExport' });
});
