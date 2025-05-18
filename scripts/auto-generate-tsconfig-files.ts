/**
 * This script updates all tsconfig.json files so that they contain
 * the meticulously correct path references to the other packages
 * that they depend on.
 */
import fs from 'fs';
import path from 'path';

export function findConfigFiles(
    dir: string,
    filename: string,
    forbiddenDirectoryNames: string[],
): string[] {
    const results: string[] = [];

    function search(currentDir: string) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);

            if (entry.isDirectory() && !forbiddenDirectoryNames.includes(entry.name)) {
                search(fullPath);
            } else if (entry.isFile() && entry.name === filename) {
                results.push(fullPath);
            }
        }
    }

    search(dir);
    return results.sort((a, b) => a.localeCompare(b));
}

export interface PackageInfo {
    name: string;
    fromPath: string;
    dependencies: string[];
}

export interface PackageInfoWithReferences extends PackageInfo {
    references: string[];
}

/**
 * Reads a package.json file and extracts the package name and workspace dependencies.
 *
 * @param packageJsonPath - The absolute path to the package.json file.
 * @param packageMap - A map to store the result, indexed by package name.
 */
export function collectPackageInfo(
    packageJsonPath: string,
    packageMap: Map<string, PackageInfo> = new Map(),
) {
    const raw = fs.readFileSync(packageJsonPath, 'utf-8');
    const pkg = JSON.parse(raw);

    if (!pkg.name) {
        throw new Error(`Package at ${packageJsonPath} has no name.`);
    }

    const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
        ...pkg.peerDependencies,
        ...pkg.optionalDependencies,
    };

    const workspaceDeps = Object.entries(allDeps)
        .filter(([, version]) => typeof version === 'string' && version.startsWith('workspace:'))
        .map(([dep]) => dep);

    packageMap.set(pkg.name, {
        name: pkg.name,
        fromPath: packageJsonPath,
        dependencies: workspaceDeps,
    });
}

/**
 * Associates each package name with the nearest tsconfig.json file.
 *
 * @param packageMap - Map of package name → PackageInfo
 * @param tsconfigFiles - List of absolute paths to tsconfig.json files
 * @returns A map of package name → tsconfig.json absolute path
 */
function mapPackageToTsconfig(
    packageMap: Map<string, PackageInfo>,
    tsconfigFiles: string[],
): Map<string, string> {
    const tsconfigMap = new Map<string, string>();

    for (const [name, pkg] of packageMap.entries()) {
        // Find the closest tsconfig.json that's in the same folder or below
        const pkgDir = path.dirname(pkg.fromPath);
        const matchingTsconfig = tsconfigFiles.find((tsconfig) => tsconfig.startsWith(pkgDir));

        if (matchingTsconfig) {
            tsconfigMap.set(name, matchingTsconfig);
        } else {
            console.warn(`⚠️ No tsconfig.json found for package ${name} in ${pkgDir}`);
        }
    }

    return tsconfigMap;
}

/**
 * Transforms a map of PackageInfo into a map of PackageInfoWithReferences.
 * Each reference is a relative path to the referenced package's tsconfig.json.
 *
 * @param packageMap - A map of package names to PackageInfo objects.
 * @param tsconfigMap - A map of package names to their tsconfig.json paths.
 * @returns A new map with `references` included.
 */
export function addPackageReferences(
    packageMap: Map<string, PackageInfo>,
    tsconfigMap: Map<string, string>,
): Map<string, PackageInfoWithReferences> {
    const result = new Map<string, PackageInfoWithReferences>();

    for (const [name, pkg] of packageMap.entries()) {
        const fromTsconfig = tsconfigMap.get(name);
        const references: string[] = pkg.dependencies
            .map((depName) => {
                const depTsconfig = tsconfigMap.get(depName);
                if (depTsconfig && fromTsconfig) {
                    const fromDir = path.dirname(fromTsconfig);
                    const toDir = path.dirname(depTsconfig);
                    return path.relative(fromDir, toDir);
                }
                return undefined;
            })
            .filter((p): p is string => Boolean(p));

        result.set(name, {
            ...pkg,
            references,
        });
    }

    return result;
}

/**
 * Overwrites the `references` field in each tsconfig.json file
 * based on the provided reference information.
 *
 * @param packages - Map of package name → PackageInfoWithReferences
 * @param tsconfigMap - Map of package name → absolute path to tsconfig.json
 */
export function updateTsconfigReferences(
    packages: Map<string, PackageInfoWithReferences>,
    tsconfigMap: Map<string, string>,
) {
    for (const [name, pkg] of packages.entries()) {
        const tsconfigPath = tsconfigMap.get(name);
        if (!tsconfigPath) {
            console.warn(`⚠️ No tsconfig path for package "${name}"`);
            continue;
        }

        let tsconfigContent: any;
        try {
            const raw = fs.readFileSync(tsconfigPath, 'utf-8');
            tsconfigContent = JSON.parse(raw);
        } catch (err) {
            console.error(`❌ Failed to read ${tsconfigPath}:`, err);
            continue;
        }

        tsconfigContent.references = pkg.references.map((relPath) => ({
            path: relPath,
        }));

        try {
            fs.writeFileSync(
                tsconfigPath,
                JSON.stringify(tsconfigContent, null, 4) + '\n',
                'utf-8',
            );
            console.log(`✅ Updated references in ${tsconfigPath}`);
        } catch (err) {
            console.error(`❌ Failed to write ${tsconfigPath}:`, err);
        }
    }
}

/**
 * Updates the `references` section in the given tsconfig.json file
 * with relative paths to all the `tsconfig.json` files from the tsconfigMap.
 * The path references will not include `tsconfig.json` at the end.
 *
 * @param rootTsconfigPath - The path to the root tsconfig.json file to update.
 * @param tsconfigMap - A map of package names to tsconfig paths.
 */
export function updateMainTsconfigReferences(
    rootTsconfigPath: string,
    tsconfigMap: Map<string, string>,
) {
    let tsconfigContent: any;
    try {
        const raw = fs.readFileSync(rootTsconfigPath, 'utf-8');
        tsconfigContent = JSON.parse(raw);
    } catch (err) {
        console.error(`❌ Failed to read ${rootTsconfigPath}:`, err);
        return;
    }

    // Collect all tsconfig paths in the map and remove `tsconfig.json` from each path
    const references = Array.from(tsconfigMap.values()).map((tsconfigPath) => {
        const relativePath = path.relative(path.dirname(rootTsconfigPath), tsconfigPath);
        // Remove `tsconfig.json` from the end of the relative path
        const pathWithoutTsconfig = path.dirname(relativePath);
        return { path: `./${pathWithoutTsconfig}` };
    });

    tsconfigContent.references = references;

    // Write updated references back to the tsconfig.json file
    try {
        fs.writeFileSync(
            rootTsconfigPath,
            JSON.stringify(tsconfigContent, null, 4) + '\n',
            'utf-8',
        );
        console.log(`✅ Updated references in ${rootTsconfigPath}`);
    } catch (err) {
        console.error(`❌ Failed to write ${rootTsconfigPath}:`, err);
    }
}

/**
 * Updates the `compilerOptions.paths` section in the given tsconfig.base.json file
 * with paths from the packageMap.
 *
 * @param baseTsconfigPath - The path to the base tsconfig.json file to update.
 * @param tsconfigMap - A map of package names to tsconfig paths.
 */
export function updateBaseTsconfigReferences(
    baseTsconfigPath: string,
    tsconfigMap: Map<string, string>,
) {
    let tsconfigContent: any;
    try {
        const raw = fs.readFileSync(baseTsconfigPath, 'utf-8');
        tsconfigContent = JSON.parse(raw);
    } catch (err) {
        console.error(`❌ Failed to read ${baseTsconfigPath}:`, err);
        return;
    }

    const sortedKeys = Array.from(tsconfigMap.keys()).sort();

    const paths: Record<string, string[]> = {};
    for (const name of sortedKeys) {
        const tsconfigPath = tsconfigMap.get(name);
        if (tsconfigPath) {
            const relativePath = path.relative(path.dirname(baseTsconfigPath), tsconfigPath);
            paths[name] = [path.dirname(relativePath).replace('../..', '.')];
        }
    }

    tsconfigContent.compilerOptions.paths = paths;

    // Write updated references back to the tsconfig.json file
    try {
        fs.writeFileSync(
            baseTsconfigPath,
            JSON.stringify(tsconfigContent, null, 4) + '\n',
            'utf-8',
        );
        console.log(`✅ Updated references in ${baseTsconfigPath}`);
    } catch (err) {
        console.error(`❌ Failed to write ${baseTsconfigPath}:`, err);
    }
}

// ------------------- main program -------------------

const tsconfigFiles = findConfigFiles('./packages', 'tsconfig.json', [
    'node_modules',
    'frontend',
    'test',
]);

const packagJsonFiles = findConfigFiles('./packages', 'package.json', ['node_modules']);

const packageMap = new Map<string, PackageInfo>();

for (const pkg of packagJsonFiles) {
    collectPackageInfo(pkg, packageMap);
}

const tsconfigMap = mapPackageToTsconfig(packageMap, tsconfigFiles);

const packageMapWithReferences = addPackageReferences(packageMap, tsconfigMap);

// console.dir(packageMapWithReferences, { depth: null });

updateTsconfigReferences(packageMapWithReferences, tsconfigMap);

const rootTsconfigPath = path.join('packages', 'tsconfig.json');
updateMainTsconfigReferences(rootTsconfigPath, tsconfigMap);

const baseTsconfigPath = path.join('config', 'typescript', 'tsconfig.base.json');
updateBaseTsconfigReferences(baseTsconfigPath, tsconfigMap);
