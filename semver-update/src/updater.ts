import semver from 'semver';

export const performVersionUpdate = (versionRegex: RegExp, contents: string, versionChangeOption: string) => {
    const match = versionRegex.exec(contents)
    if (match === null || match.length < 2) {
        throw new Error('no match found in source file')
    }

    const currentVersion = match[1];
    const cleaned = semver.clean(currentVersion);
    if (!cleaned || !semver.valid(cleaned)) {
        throw new Error(`invalid version: ${currentVersion}`)
    }

    let updatedVersion: string | null = '';
    switch (versionChangeOption) {
        case 'major':
        case 'minor':
        case 'patch':
            updatedVersion = semver.inc(cleaned, versionChangeOption);
            break;

        default:
            updatedVersion = versionChangeOption;
    }

    if (!updatedVersion || !semver.valid(updatedVersion)) {
        throw new Error(`invalid updated version: ${updatedVersion}`)        
    }

    if (currentVersion.startsWith('v')) {
        updatedVersion = 'v' + updatedVersion;
    }
    
    const replacementStr = match[0].replace(currentVersion, updatedVersion);
    return contents.replace(versionRegex, replacementStr)
};