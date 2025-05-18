import { fileURLToPath } from 'url';
import path from 'path';

const myFilename = fileURLToPath(import.meta.url);
const myDirname = path.dirname(myFilename);

/**
 * Resolves the absolute path to a shared file inside
 * the common frontend module.
 */
export function resolveCommonPath(...segments: string[]): string {
    return path.resolve(myDirname, 'web', 'src', ...segments);
}
