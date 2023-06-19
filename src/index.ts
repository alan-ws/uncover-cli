#! /usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
import path from "node:path";
import { access, constants } from "node:fs/promises";
import { Separator, select } from "@inquirer/prompts";
import { spawn } from "node:child_process";
import { exec } from "node:child_process";

const program = new Command();
console.log(figlet.textSync("uncover"));
const opts = program.opts();

async function execute(filePath: string) {
  const envvars = process.env;
  const exts = (envvars.PATHEXT || '').split(path.delimiter).concat('');

  const bins = await Promise.all(exts.map(async ext => {
    try {
      await access(filePath + ext, constants.X_OK)
      return filePath + ext;
    } catch (err) {
      // console.error(err)
      return undefined
    }
  }));
  return bins.find(bin => !!bin);
}

// const exec = (fpath: string): Promise<string | undefined> => {
//   return new Promise(resolve => fs.access(fpath, fs.constants.X_OK, err => resolve(err ? undefined : fpath)));
// };

program
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .option("-i --install", "Install the core, base components")
  .option(
    "-ii --interactive-install",
    "Interactive install - requires complete new install"
  )
  .option("-r --run", "Run test on local machine")
  .action(async () => {
    if (opts.install) {
      if (process.platform === 'win32') {
        let answer = await select({
          message: "Select your Windows package manner",
          choices: [
            new Separator(
              "== Package Managers [Enter to select] =="
            ),
            { value: "choco" },
            { value: "scoop" },
            { value: "winget" }
          ],
        });

        const child = exec(`${answer} install k6`, (e, sto, ste) => {
          // console.log(sto)
        })
        child.stdout?.on('data', console.log)
      }
      console.log(process.platform)
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
  })
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

