import {performVersionUpdate} from '../src/updater'
import { describe, it, expect } from 'vitest'

describe('performVersionUpdate', () => {
    it('raises exception for a non-matching regex', () => {
        const contents = `
        PATH
        remote: .
        specs:
          authzed (0.7.0)
            grpc (~> 1.41)
            grpc-tools (~> 1.41)
        `;

        const t = () => {
          performVersionUpdate(new RegExp('authzesd \(.+\)'), contents, 'minor');
        };
        expect(t).toThrow(/no match/);
    })

    it('raises exception for a non-semver version', () => {
        const contents = `
        PATH
        remote: .
        specs:
          authzed (somever)
            grpc (~> 1.41)
            grpc-tools (~> 1.41)
        `;

        const t = () => {
          performVersionUpdate(new RegExp('authzed \\((.+)\\)'), contents, 'minor');
        };
        expect(t).toThrow(/invalid version/);
    })

    it('properly updates a patch version', () => {
        const contents = `
        PATH
        remote: .
        specs:
          authzed (0.7.0)
            grpc (~> 1.41)
            grpc-tools (~> 1.41)
        `;

        const updated = performVersionUpdate(new RegExp('authzed \\((.+)\\)'), contents, 'patch');
        expect(updated).toEqual(`
        PATH
        remote: .
        specs:
          authzed (0.7.1)
            grpc (~> 1.41)
            grpc-tools (~> 1.41)
        `)
    })

    it('properly updates a minor version', () => {
        const contents = `
        PATH
        remote: .
        specs:
          authzed (0.7.0)
            grpc (~> 1.41)
            grpc-tools (~> 1.41)
        `;

        const updated = performVersionUpdate(new RegExp('authzed \\((.+)\\)'), contents, 'minor');
        expect(updated).toEqual(`
        PATH
        remote: .
        specs:
          authzed (0.8.0)
            grpc (~> 1.41)
            grpc-tools (~> 1.41)
        `)
    })

    it('properly updates a major version', () => {
        const contents = `
        PATH
        remote: .
        specs:
          authzed (0.7.0)
            grpc (~> 1.41)
            grpc-tools (~> 1.41)
        `;

        const updated = performVersionUpdate(new RegExp('authzed \\((.+)\\)'), contents, 'major');
        expect(updated).toEqual(`
        PATH
        remote: .
        specs:
          authzed (1.0.0)
            grpc (~> 1.41)
            grpc-tools (~> 1.41)
        `)
    })

    it('properly updates a custom version', () => {
        const contents = `
        PATH
        remote: .
        specs:
          authzed (0.7.0)
            grpc (~> 1.41)
            grpc-tools (~> 1.41)
        `;

        const updated = performVersionUpdate(new RegExp('authzed \\((.+)\\)'), contents, '1.2.3');
        expect(updated).toEqual(`
        PATH
        remote: .
        specs:
          authzed (1.2.3)
            grpc (~> 1.41)
            grpc-tools (~> 1.41)
        `)
    })

    it('properly updates a version starting with a v', () => {
        const contents = `
        PATH
        remote: .
        specs:
          authzed (v0.7.0)
            grpc (~> 1.41)
            grpc-tools (~> 1.41)
        `;

        const updated = performVersionUpdate(new RegExp('authzed \\((.+)\\)'), contents, '1.2.3');
        expect(updated).toEqual(`
        PATH
        remote: .
        specs:
          authzed (v1.2.3)
            grpc (~> 1.41)
            grpc-tools (~> 1.41)
        `)
    })
});
