import * as core from '@actions/core';
import fs from 'fs';
import util from 'util'
import { FileFormatType, fileFormatHandlers } from './handlers';


async function run() {
  try {
    const apiCommit = core.getInput('api-commit');
    console.log(`Updating for buf API commit: https://buf.build/authzed/api/docs/${apiCommit}`);
  
    const specFilePath = core.getInput('spec-path');
    if (!specFilePath) {
      throw new Error(`missing spec file path`)
    }
  
    const fileFormat = core.getInput('file-format');
    if (!(fileFormat in fileFormatHandlers)) {
      throw new Error(`unknown file format handler: ${fileFormat}`)
    }

    const readFile = util.promisify(fs.readFile)
    const contents = await readFile(specFilePath, 'utf8');
    const [updatedContents, changed] = fileFormatHandlers[fileFormat as FileFormatType](contents, apiCommit);
    if (!changed) {
      core.setOutput("updated", 'false')  
      console.log(`no updates found to apply`)
      return
    }    

    // Write the updated spec file.
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(specFilePath, updatedContents);

    // Done.
    core.setOutput("updated", 'true')  
    console.log(`successfully generated updated API protos`)
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run()