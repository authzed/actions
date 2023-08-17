export type FileFormatType = "generate-shell-script" | "gradle"
export type Handler = (contents: string, apiCommit: string) => [string, boolean]

export const fileFormatHandlers: Record<FileFormatType, Handler> = {
  'generate-shell-script': (contents: string, apiCommit: string) => {
    // Format: `generate buf.build/authzed/api:dc592e107033a7a4336935cf94fb90426719508d `
    const regex = new RegExp(`generate buf.build/authzed/api:(.+) `);
    if (!regex.test(contents)) {
      throw new Error(`missing expected generate buf command in shell script`)
    }

    const updatedContents = contents.replace(regex, `generate buf.build/authzed/api:${apiCommit} `);
    return [updatedContents, contents !== updatedContents]
  },
  'gradle': (contents: string, apiCommit: string) => {
    // Format: `def authzedProtoCommit = "c9dc57b6f25666952f736f5b3ba621397b5e09a3"`
    const regex = new RegExp(`def authzedProtoCommit = "(.+)"`);
    if (!regex.test(contents)) {
      throw new Error(`missing expected var definition in gradle file`)
    }

    const updatedContents = contents.replace(regex, `def authzedProtoCommit = "${apiCommit}"`);
    return [updatedContents, contents !== updatedContents]
  },
};
