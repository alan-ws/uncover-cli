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
const node_fs_1 = require("node:fs");
const program = new commander_1.Command();
console.log(figlet_1.default.textSync("uncover"));
const opts = program.opts();
const iAccess = (fpath) => {
    return new Promise((resolve) => (0, node_fs_1.access)(fpath, node_fs_1.constants.X_OK, (err) => resolve(err ? undefined : fpath)));
};
const isExecutable = (abspath) => __awaiter(void 0, void 0, void 0, function* () {
    const envvars = process.env;
    const exts = (envvars.PATHEXT || "").split(node_path_1.default.delimiter).concat("");
    const bins = yield Promise.all(exts.map((ext) => iAccess(abspath + ext)));
    return bins.find((bin) => !!bin);
});
program
    .version("1.0.0")
    .description("An example CLI for managing a directory")
    .option("-i --install", "Install the core, base components")
    .option("-ii --interactive-install", "Interactive install - requires complete new install")
    .option("-rl --run-local", "Run test on local machine")
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (opts.interactiveInstall) {
        console.log("performing initial checks");
        const m = "node".includes(node_path_1.default.sep) ? node_path_1.default.resolve("node") : undefined;
        const d = (_a = process.env.PATH) === null || _a === void 0 ? void 0 : _a.split(node_path_1.default.delimiter).concat([]).filter((p) => !(undefined || []).includes(p));
        const b = yield Promise.all(d.map((s) => isExecutable(node_path_1.default.join(s, "node"))));
        console.log(b);
        //   let answers = await checkbox({
        //     message: "Select the components you need",
        //     choices: [
        //       new Separator(
        //         "== Components (choices cycle as you scroll through) =="
        //       ),
        //       { value: "disruptor" },
        //       { value: "distributed-tracing" },
        //     ],
        //   });
    }
}))
    .parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map