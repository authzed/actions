"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performVersionUpdate = void 0;
const semver_1 = __importDefault(require("semver"));
const performVersionUpdate = (versionRegex, contents, versionChangeOption) => {
    const match = versionRegex.exec(contents);
    if (match === null || match.length < 2) {
        throw new Error('no match found in source file');
    }
    const currentVersion = match[1];
    const cleaned = semver_1.default.clean(currentVersion);
    if (!cleaned || !semver_1.default.valid(cleaned)) {
        throw new Error(`invalid version: ${currentVersion}`);
    }
    let updatedVersion = '';
    switch (versionChangeOption) {
        case 'major':
        case 'minor':
        case 'patch':
            updatedVersion = semver_1.default.inc(cleaned, versionChangeOption);
            break;
        default:
            updatedVersion = versionChangeOption;
    }
    if (!updatedVersion || !semver_1.default.valid(updatedVersion)) {
        throw new Error(`invalid updated version: ${updatedVersion}`);
    }
    if (currentVersion.startsWith('v')) {
        updatedVersion = 'v' + updatedVersion;
    }
    const replacementStr = match[0].replace(currentVersion, updatedVersion);
    return contents.replace(versionRegex, replacementStr);
};
exports.performVersionUpdate = performVersionUpdate;
