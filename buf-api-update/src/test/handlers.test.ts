import {fileFormatHandlers} from '../handlers'
import { readFile } from 'fs/promises';
import { join } from 'path';
import { describe, expect, it } from 'vitest'

describe('shell script format handler', () => {
    const handler = fileFormatHandlers['generate-shell-script'];

    it('properly changes the buf version', () => {
        const [contents, updated] = handler(`#!/usr/bin/env -S buf generate buf.build/authzed/api:dc592e107033a7a4336935cf94fb90426719508d --template`, 'somenewversion')

        expect(updated).toBe(true);
        expect(contents).toBe(`#!/usr/bin/env -S buf generate buf.build/authzed/api:somenewversion --template`);
    })

    it('does not change a static buf version', () => {
        const [, updated] = handler(`#!/usr/bin/env -S buf generate buf.build/authzed/api:dc592e107033a7a4336935cf94fb90426719508d --template`, 'dc592e107033a7a4336935cf94fb90426719508d')
        expect(updated).toBe(false);
    })
});

describe('gradle format handler', () => {
    const handler = fileFormatHandlers['gradle'];

    it('properly changes the buf version', () => {
        const [contents, updated] = handler(`def grpcVersion = "1.39.0"
def protocVersion = "3.17.3"
def authzedProtoCommit = "c9dc57b6f25666952f736f5b3ba621397b5e09a3"
def bufDir = "somedir"`, 'somenewversion')

        expect(updated).toBe(true);
        expect(contents).toBe(`def grpcVersion = "1.39.0"
def protocVersion = "3.17.3"
def authzedProtoCommit = "somenewversion"
def bufDir = "somedir"`);
    })

    it('does not change a static buf version', () => {
        const [, updated] = handler(`def grpcVersion = "1.39.0"
def protocVersion = "3.17.3"
def authzedProtoCommit = "dc592e107033a7a4336935cf94fb90426719508d"
def bufDir = "somedir"`, 'dc592e107033a7a4336935cf94fb90426719508d')
        expect(updated).toBe(false);
    })
});

const readFileAsString = async (relativePath: string) => {
    const resolvedPath = join(__dirname, relativePath)
    const buffer = await readFile(resolvedPath)
    return buffer.toString()
}

describe('buf-gen-yaml format handler', () => {
    it('properly changes the buf version', async () => {
        const handler = fileFormatHandlers['buf-gen-yaml']
        const [input, expected] = await Promise.all(
            ["./yaml/buf.gen.yaml", "./yaml/buf.gen.yaml.expected"]
            .map(readFileAsString)
        )
        const [output, changed] = handler(input, "v1.38.0")
        expect(changed).toBe(true)
        expect(output).toEqual(expected)
    })
})
