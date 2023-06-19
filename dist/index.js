#! /usr/bin/env node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const figlet_1 = __importDefault(require("figlet"));
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = require("node:fs/promises");
const prompts_1 = require("@inquirer/prompts");
const node_child_process_1 = require("node:child_process");
const program = new commander_1.Command();
console.log(figlet_1.default.textSync("uncover"));
const opts = program.opts();
function execute(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const envvars = process.env;
        const exts = (envvars.PATHEXT || '').split(node_path_1.default.delimiter).concat('');
        const bins = yield Promise.all(exts.map((ext) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, promises_1.access)(filePath + ext, promises_1.constants.X_OK);
                return filePath + ext;
            }
            catch (err) {
                // console.error(err)
                return undefined;
            }
        })));
        return bins.find(bin => !!bin);
    });
}
// const exec = (fpath: string): Promise<string | undefined> => {
//   return new Promise(resolve => fs.access(fpath, fs.constants.X_OK, err => resolve(err ? undefined : fpath)));
// };
program
    .version("1.0.0")
    .description("An example CLI for managing a directory")
    .option("-i --install", "Install the core, base components")
    .option("-ii --interactive-install", "Interactive install - requires complete new install")
    .option("-r --run", "Run test on local machine")
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (opts.install) {
        if (process.platform === 'win32') {
            let answer = yield (0, prompts_1.select)({
                message: "Select your Windows package manner",
                choices: [
                    new prompts_1.Separator("== Package Managers [Enter to select] =="),
                    { value: "choco" },
                    { value: "scoop" },
                    { value: "winget" }
                ],
            });
            const child = (0, node_child_process_1.exec)(`${answer} install k6`, (e, sto, ste) => {
                // console.log(sto)
            });
            (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on('data', console.log);
            console.log('does it fuck out');
        }
        console.log(process.platform);
    }
    // if (opts.interactiveInstall) {
    //   let filePath = "go".includes(path.sep) ? path.resolve("go") : undefined;
    //   if (filePath) await execute(filePath);
    //   let dirs = process.env.PATH?.split(path.delimiter);
    //   let bins = await Promise.all(dirs!.map(async dir => {
    //     try {
    //       return await execute(path.join(dir, "go"))
    //     } catch (er) {
    //       // console.error(er)
    //     }
    //   }));
    //   const goPath = bins.find(bin => !!bin)
    // }
}))
    .parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map