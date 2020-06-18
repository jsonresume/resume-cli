#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var init_1 = __importDefault(require("./init"));
var test_schema_1 = __importDefault(require("./test-schema"));
var export_resume_1 = __importDefault(require("./export-resume"));
var serve_1 = __importDefault(require("./serve"));
var pre_flow_1 = __importDefault(require("./pre-flow"));
var commander_1 = __importDefault(require("commander"));
var chalk_1 = __importDefault(require("chalk"));
var path_1 = __importDefault(require("path"));
var pkg = require('../package.json');
require('dotenv').load({ silent: true });
pre_flow_1.default(function (err, results) {
    return __awaiter(this, void 0, void 0, function () {
        var resumeJson, validCommands;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resumeJson = results.getResume;
                    commander_1.default
                        .usage('[command] [options]')
                        .version(pkg.version)
                        .option('-t, --theme <theme name>', 'Specify theme used by `export` (modern, crisp, flat: default)', 'flat')
                        .option('-f, --format <file type extension>', 'Used by `export`.')
                        .option('-r, --resume <resume filename>', 'Used by `serve` (default: resume.json)', path_1.default.join(process.cwd(), 'resume.json'))
                        .option('-p, --port <port>', 'Used by `serve` (default: 4000)', 4000)
                        .option('-s, --silent', 'Used by `serve` to tell it if open browser auto or not.', false)
                        .option('-d, --dir <path>', 'Used by `serve` to indicate a public directory path.', 'public');
                    commander_1.default
                        .command('init')
                        .description('Initialize a resume.json file')
                        .action(function () {
                        init_1.default();
                    });
                    commander_1.default
                        .command('test')
                        .description('Schema validation test your resume.json')
                        .action(function () {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, test_schema_1.default(resumeJson)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    });
                    commander_1.default
                        .command('export [fileName]')
                        .description('Export locally to .html or .pdf. Supply a --format <file format> flag and argument to specify export format.')
                        .action(function (fileName) {
                        export_resume_1.default(resumeJson, fileName, commander_1.default, function (err, fileName, format) {
                            console.log(chalk_1.default.green('\nDone! Find your new', format, 'resume at:\n', path_1.default.resolve(process.cwd(), fileName + format)));
                        });
                    });
                    commander_1.default
                        .command('serve')
                        .description('Serve resume at http://localhost:4000/')
                        .action(function () {
                        serve_1.default(commander_1.default.port, commander_1.default.theme, commander_1.default.silent, commander_1.default.dir, commander_1.default.resume);
                    });
                    return [4 /*yield*/, commander_1.default.parseAsync(process.argv)];
                case 1:
                    _a.sent();
                    validCommands = commander_1.default.commands.map(function (cmd) {
                        return cmd._name;
                    });
                    if (!commander_1.default.args.length) {
                        console.log('resume-cli:'.cyan, 'https://jsonresume.org', '\n');
                        commander_1.default.help();
                    }
                    else if (validCommands.indexOf(process.argv[2]) === -1) {
                        console.log('Invalid argument:'.red, process.argv[2]);
                        console.log('resume-cli:'.cyan, 'https://jsonresume.org', '\n');
                        commander_1.default.help();
                    }
                    return [2 /*return*/];
            }
        });
    });
});
