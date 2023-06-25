#! /usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { install } from "./commnds/install";

let program = new Command();
console.log(figlet.textSync("uncover"));

program
  .name('uncover')
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .usage('<command> [options] [...]')

program
  .option('-v, --verbose', 'enable verbose mode')
  .option('-d, --debug', 'enable debug mode');

const installCommand = install();

program.addCommand(installCommand)
program.parse()
// .option("-i --install", "Install the core, base components")
// .option(
//   "-ii --interactive-install",
//   "Interactive install - requires complete new install"
// )
// .option("-r --run [file] [url]", "Run test on local machine")
// .action(async () => {

//   let answer: string | undefined;
//   if (opts.install) {
//     if (process.platform === "win32") {
//       answer = await select({
//         message: "Select your Windows package manner",
//         choices: [
//           new Separator("== Package Managers [Enter to select] =="),
//           { value: "choco" },
//           { value: "scoop" },
//           { value: "winget" },
//           { value: "other" },
//         ],
//       });
//     }

//     if (process.platform === "darwin") {
//       answer = await select({
//         message: "Select your Windows package manner",
//         choices: [
//           new Separator("== Package Managers [Enter to select] =="),
//           { value: "brew" },
//           { value: "other" },
//         ],
//       });
//     }

//     console.log(answer);
//     if (answer === "other") {
//       console.log(
//         "Use the interactive install [uncover -ii] to build from binary"
//       );
//       exit;
//     } else {
//       const child = exec(`${answer} install k6`, (e, sto, ste) => {
//         // console.log(sto)
//       });
//       child.stdout?.on("data", console.log);
//     }
//   }
//   // if (opts.interactiveInstall) {
//   //   let filePath = "go".includes(path.sep) ? path.resolve("go") : undefined;
//   //   if (filePath) await execute(filePath);
//   //   let dirs = process.env.PATH?.split(path.delimiter);
//   //   let bins = await Promise.all(dirs!.map(async dir => {
//   //     try {
//   //       return await execute(path.join(dir, "go"))
//   //     } catch (er) {
//   //       // console.error(er)
//   //     }
//   //   }));
//   //   const goPath = bins.find(bin => !!bin)
//   // }
// })
// .parse(process.argv);

// if (process.argv.slice(2).length) {
//   if (opts.run) {
//     program.action(async () => {
//       if (typeof opts.run === 'string') {
//         if (opts.run.startsWith('https') || opts.run.includes('.com')) {
//           const dir = await mkdtemp(join(tmpdir(), 'uncover-'))
//           await writeFile(`${join(dir, "/script.js")}`, basic(opts.run))
//           const { stderr, stdout } = await execified(
//             `k6 run ${join(dir, "/script.js")}`
//           );
//           console.log(stdout)
//           await rm(join(dir, "/script.js"))
//           await rmdir(dir)
//           return;
//         }
//         const { stderr, stdout } = await execified(
//           `k6 run ${join(__dirname, opts.run)}`
//         );

//         console.log(stdout)
//       }
//     })
//   }
// }

if (!process.argv.slice(2).length) {
  program.outputHelp();
  console.log('\n')
}
