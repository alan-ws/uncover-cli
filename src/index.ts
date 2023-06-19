#! /usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
import util from "node:util";
import path from "node:path";
import { access, constants } from "node:fs";
import { takeCoverage } from "node:v8";

const program = new Command();
console.log(figlet.textSync("uncover"));
const opts = program.opts();

const iAccess = (fpath: string): Promise<string | undefined> => {
  return new Promise((resolve) =>
    access(fpath, constants.X_OK, (err) => resolve(err ? undefined : fpath))
  );
};
const isExecutable = async (abspath: string): Promise<string | undefined> => {
  const envvars = process.env;
  const exts = (envvars.PATHEXT || "").split(path.delimiter).concat("");
  const bins = await Promise.all(exts.map((ext) => iAccess(abspath + ext)));
  return bins.find((bin) => !!bin);
};
program
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .option("-i --install", "Install the core, base components")
  .option(
    "-ii --interactive-install",
    "Interactive install - requires complete new install"
  )
  .option("-rl --run-local", "Run test on local machine")
  .action(async () => {
    if (opts.interactiveInstall) {
      console.log("performing initial checks");

      const m = "node".includes(path.sep) ? path.resolve("node") : undefined;
      const d = process.env.PATH?.split(path.delimiter)
        .concat([])
        .filter((p) => !(undefined || []).includes(p as never));
      const b = await Promise.all(
        d!.map((s) => isExecutable(path.join(s, "node")))
      );
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
  })
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
