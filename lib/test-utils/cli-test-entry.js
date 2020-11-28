import build from './mocked-volume-builder.js';
import { patchFs } from 'fs-monkey';
import { ufs } from 'unionfs';
import * as fs from 'fs';

const mockVolume = build({ mount: '/test-resumes' });
const vol = ufs.use(mockVolume).use(fs);
patchFs(vol);

process.once('beforeExit', () => {
  process.send({ data: mockVolume.toJSON(), type: 'volumeExport' });
});

import '../main.js';
