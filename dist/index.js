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
const prompts_1 = require("@inquirer/prompts");
const node_child_process_1 = require("node:child_process");
const node_process_1 = require("node:process");
const node_util_1 = require("node:util");
const execified = (0, node_util_1.promisify)(node_child_process_1.exec);
const program = new commander_1.Command();
console.log(figlet_1.default.textSync("uncover"));
const opts = program.opts();
// async function execute(filePath: string) {
//   const envvars = process.env;
//   const exts = (envvars.PATHEXT || "").split(path.delimiter).concat("");
//   const bins = await Promise.all(
//     exts.map(async (ext) => {
//       try {
//         await access(filePath + ext, constants.X_OK);
//         return filePath + ext;
//       } catch (err) {
//         // console.error(err)
//         return undefined;
//       }
//     })
//   );
//   return bins.find((bin) => !!bin);
// }
program
    .version("1.0.0")
    .description("An example CLI for managing a directory")
    .option("-i --install", "Install the core, base components")
    .option("-ii --interactive-install", "Interactive install - requires complete new install")
    .option("-r --run", "Run test on local machine")
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (opts.run) {
        console.log(node_path_1.default.join(__dirname, "script.js"));
        const { stderr, stdout } = (0, node_child_process_1.exec)(`k6 run ${node_path_1.default.join(__dirname, "script.js")}`);
        stdout === null || stdout === void 0 ? void 0 : stdout.on("data", (data) => {
            console.log(data);
        });
    }
    let answer;
    if (opts.install) {
        if (process.platform === "win32") {
            answer = yield (0, prompts_1.select)({
                message: "Select your Windows package manner",
                choices: [
                    new prompts_1.Separator("== Package Managers [Enter to select] =="),
                    { value: "choco" },
                    { value: "scoop" },
                    { value: "winget" },
                    { value: "other" },
                ],
            });
        }
        if (process.platform === "darwin") {
            answer = yield (0, prompts_1.select)({
                message: "Select your Windows package manner",
                choices: [
                    new prompts_1.Separator("== Package Managers [Enter to select] =="),
                    { value: "brew" },
                    { value: "other" },
                ],
            });
        }
        console.log(answer);
        if (answer === "other") {
            console.log("Use the interactive install [uncover -ii] to build from binary");
            node_process_1.exit;
        }
        else {
            const child = (0, node_child_process_1.exec)(`${answer} install k6`, (e, sto, ste) => {
                // console.log(sto)
            });
            (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", console.log);
        }
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