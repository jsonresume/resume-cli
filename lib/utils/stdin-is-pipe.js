import { fstat as fstatCB } from 'fs';
import { promisify } from 'util';

const fstat = promisify(fstatCB);

const is = async () => {
  try {
    const fstatStdin = await fstat(process.stdin.fd);
    return fstatStdin.isFIFO();
  } catch {
    // probably EBADF: bad file descriptor, fstat node stdin
  }
  return !process.stdin.isTTY;
};
export const not = async () => !(await is());
export default is;
