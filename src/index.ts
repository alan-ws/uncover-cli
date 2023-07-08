#! /usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
import {
  appendFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { access, constants, lstat } from "node:fs/promises";
import path from "node:path";
import { exit } from "node:process";
import { promisify } from "node:util";
import { exec } from "node:child_process";
import { Separator, select } from "@inquirer/prompts";
import { basic } from "./scripts/index.js";

const execified = promisify(exec);

async function streamableExec(command: string): Promise<number | null> {
  return new Promise((resolve, reject) => {
    const child = exec(command);
    child.stdout?.on('data', (chunk: any) => {
      if (chunk.toLowerCase().match('updating')) {
        console.log('update your package manager')
        resolve(1);
      } else {
        console.log(chunk);
      }
    })
    child.stderr?.on('data', (chunk: any) => {
      console.log(chunk);
      resolve(1)
    })
    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(code);
      }
    });
  });
}

async function canAccessR_OK(args: string) {
  try {
    await access(args, constants.R_OK);
    console.log(`uncover can access: ${args}`);
  } catch (err) {
    console.log(`uncover does not have read permissions for: ${args}`);
    exit(1);
  }
}

let program = new Command();

console.log(figlet.textSync("uncover"));

program
  .name("uncover")
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .usage("<command> [options] [...]");
program.option("-v, --verbose", "enable verbose mode");

async function LinkCommand() {
  const program = new Command("link");
  program.name("link");
  program.description("link to your vercel project");
  program.option(
    "-p, --project-id [id]",
    "provide project id",
    ".vercel/project.json"
  );
  program.option(
    "-t, --team-id [id]",
    "provide team id",
    ".vercel/project.json"
  );
  program.option(
    "-g, --git-username [name]",
    "provide git username",
    "git config --list"
  );
  program.option(
    "-d, --directory [dir]",
    "point uncover to directory to link",
    "."
  );
  program.action(async (args) => {
    let { directory, projectId, teamId, gitUsername } = args;

    enum Filenames {
      uncover = "uncover.json",
      git = ".gitignore",
      vercel = ".vercelignore",
    }

    if (
      directory === true ||
      projectId === true ||
      teamId === true ||
      gitUsername === true
    ) {
      console.log(
        "link uses default values, if a flag is used, please provide a value"
      );
      exit(1);
    }

    directory = process.cwd();

    if (existsSync(path.join(directory, Filenames.uncover))) {
      console.log("project is already linked");
      exit(0);
    }

    try {
      (await lstat(directory)).isDirectory();
    } catch (err) {
      console.debug("directory check: ", err);
    }

    if (gitUsername === "git config --list") {
      canAccessR_OK(path.join(directory, ".git"));
      const { stderr, stdout } = await execified(gitUsername);
      if (stderr) exit(1);
      const gitUsernameRegex = stdout.match(/user\.name=(.*)\n/)
      gitUsername = gitUsernameRegex && gitUsernameRegex[1];
    }

    if (projectId === ".vercel/project.json") {
      canAccessR_OK(path.join(directory, projectId));
      const file = JSON.parse(
        readFileSync(path.join(directory, projectId), {
          encoding: "utf-8",
        })
      );
      projectId = file.projectId;
    }

    if (teamId === ".vercel/project.json") {
      canAccessR_OK(path.join(directory, teamId));
      const file = JSON.parse(
        readFileSync(path.join(directory, teamId), {
          encoding: "utf-8",
        })
      );
      teamId = file.orgId;
    }

    canAccessR_OK(directory);

    writeFileSync(
      path.join(directory, Filenames.uncover),
      JSON.stringify({
        uncover: "enabled",
        projectId: projectId,
        teamId: teamId,
        gitUserName: gitUsername
      }),
      { encoding: "utf-8" }
    );

    if (existsSync(path.join(directory, Filenames.vercel))) {
      console.log("adding uncover.json to vercelignore");
      appendFileSync(
        path.join(directory, Filenames.vercel),
        "\n#uncover\nuncover.json"
      );
    } else {
      console.log("adding vercelignore and appending uncover.json");
      writeFileSync(
        path.join(directory, Filenames.vercel),
        "#uncover\nuncover.json",
        {
          encoding: "utf-8",
        }
      );
    }

    if ((await lstat(path.join(directory, ".git"))).isDirectory()) {
      if (existsSync(path.join(directory, Filenames.git))) {
        console.log("adding uncover.json to gitignore");
        appendFileSync(
          path.join(directory, Filenames.git),
          "\n#uncover\nuncover.json"
        );
      } else {
        console.log("adding gitignore and appending uncover.json");
        writeFileSync(
          path.join(directory, Filenames.git),
          "#uncover\nuncover.json",
          {
            encoding: "utf-8",
          }
        );
      }
    }
  });
  return program;
}

async function InstallCommand() {
  const program = new Command('install')
  program.description('default non-interactive installation')
  program.option('-i --interactive', 'install from binary and select packages')
  program.action(async (args) => {
    if (program.args.length > 1) {
      throw Error('install does not accept arguements')
    }

    if (args.interactive === true) {
      console.log('Not implemented')
      return
    }

    let answer: string | undefined;
    if (process.platform === "win32") {
      answer = await select({
        message: "Select your Windows package manner",
        choices: [
          new Separator("== Package Managers [Enter to select] =="),
          { value: "choco" },
          { value: "scoop" },
          { value: "winget" },
          { value: "other" },
        ],
      });
    }

    if (process.platform === "darwin") {
      answer = await select({
        message: "Select your MacOS package manner",
        choices: [
          new Separator("== Package Managers [Enter to select] =="),
          { value: "brew" },
          { value: "other" },
        ],
      });
    }

    if (answer === "other") {
      console.log(
        `Use -i or --interactive with uncover install\n`
      );
      exit(1);
    } else {
      try {
        exit(await streamableExec(`${answer} install k6`) ?? 1);
      } catch (err) {
        console.error(err)
      }
    }
  })
  return program
}

async function RunCommand() {
  // some of the options
  // quiet (very little output)
  // detached (no output other than the PID)
  /* 
    could have default values for VUS (based on low -> high traffic & test type) and DURATION (based on test type)
    ability to pass in an options file -> to add to the options config of k6
      lets make this file yaml and the ability to add in scenarios
  */
  const program = new Command("run")
  program.description("run various tests locally or burst to remote")
  // program.command("load")
  //   .description("run a load test")
  program.command("smoke")
    .description("run a smoke test")
  // program.command("stress")
  //   .description("run a stress test")
  // program.command("soak")
  //   .description("run a soak test")
  // program.command("spike")
  //   .description("run a spike test")
  // program.command("breakpoint")
  //   .description("run a breakpoint test")
  return program
}

program.addCommand(await LinkCommand());
program.addCommand(await InstallCommand());
program.addCommand(await RunCommand());
await program.parseAsync(process.argv);
