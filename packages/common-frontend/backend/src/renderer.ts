import { readFileSync } from 'fs';
import mustache from 'mustache';
import path from 'path';
import { memo } from 'radashi';

import { resolveCommonPath } from './path-utils.js';

const getTemplate = memo((basePath: string, partialsPath: string | null, filename: string) => {
    let localPath: string;
    let commonPath: string;

    if (partialsPath) {
        localPath = path.join(basePath, partialsPath, filename);
        commonPath = resolveCommonPath(partialsPath, filename);
    } else {
        localPath = path.join(basePath, filename);
        commonPath = resolveCommonPath(filename);
    }

    try {
        // console.log('-> trying', localPath);
        return readFileSync(localPath, 'utf8'); // Return file if found in local dir
    } catch {
        // console.log('-> fallback to', commonPath);
        return readFileSync(commonPath, 'utf8'); // Fallback to common dir when not found in local dir
    }
});

export const renderer = (webDir: string) => (viewName: string, variables: object) => {
    const relativePartialsDir = 'partials';

    return mustache.render(getTemplate(webDir, null, viewName), variables, (partial) =>
        getTemplate(
            webDir,
            relativePartialsDir,
            partial.includes('.') ? partial : `${partial}.html`,
        ),
    );
};
