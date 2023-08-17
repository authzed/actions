"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const handlers_1 = require("./handlers");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const apiCommit = core.getInput('api-commit');
            console.log(`Updating for buf API commit: https://buf.build/authzed/api/docs/${apiCommit}`);
            const specFilePath = core.getInput('spec-path');
            if (!specFilePath) {
                throw new Error(`missing spec file path`);
            }
            const fileFormat = core.getInput('file-format');
            if (!(fileFormat in handlers_1.fileFormatHandlers)) {
                throw new Error(`unknown file format handler: ${fileFormat}`);
            }
            const readFile = util_1.default.promisify(fs_1.default.readFile);
            const contents = yield readFile(specFilePath, 'utf8');
            const [updatedContents, changed] = handlers_1.fileFormatHandlers[fileFormat](contents, apiCommit);
            if (!changed) {
                core.setOutput("updated", 'false');
                console.log(`no updates found to apply`);
                return;
            }
            // Write the updated spec file.
            const writeFile = util_1.default.promisify(fs_1.default.writeFile);
            yield writeFile(specFilePath, updatedContents);
            // Done.
            core.setOutput("updated", 'true');
            console.log(`successfully generated updated API protos`);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
