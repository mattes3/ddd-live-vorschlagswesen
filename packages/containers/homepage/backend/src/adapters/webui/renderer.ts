import { fileURLToPath } from 'url';
import path from 'path';
import { renderer } from '@vorschlagswesen/common-frontend';

const myFilename = fileURLToPath(import.meta.url);
const myDirname = path.dirname(myFilename);

const webDir = path.join(myDirname, '..', '..', '..', '..', 'frontend');

export const render = renderer(webDir);
