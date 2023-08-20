import * as core from '@actions/core';
import fs from 'fs';
import util from 'util'
import { performVersionUpdate } from './updater';


async function run() {
  try {  
    const sourceFilePath = core.getInput('sourcefile-path');
    if (!sourceFilePath) {
      throw new Error(`missing source file path`)
    }
  
    const versionRegexStr = core.getInput('version-regex');
    if (!versionRegexStr) {
      throw new Error(`missing version regex`)
    }

    const versionChangeOption = core.getInput('version-change');
    if (!versionChangeOption) {
      throw new Error(`missing version change option`)
    }

    const versionRegex = new RegExp(versionRegexStr);

    const readFile = util.promisify(fs.readFile)
    const contents = await readFile(sourceFilePath, 'utf8');

    const updatedContents = performVersionUpdate(versionRegex, contents, versionChangeOption);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(sourceFilePath, updatedContents);

    console.log(`successfully updated version`)
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run()