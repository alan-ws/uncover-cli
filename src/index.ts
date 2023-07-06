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
import { exit, pid } from "node:process";

let program = new Command();

console.log(figlet.textSync("uncover"));

program
  .name("uncover")
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .usage("<command> [options] [...]");
program.option("-v, --verbose", "enable verbose mode");

function canAccessR_OK(args: string) {
  try {
    access(args, constants.R_OK);
    console.log(`uncover can access: ${args}`);
  } catch (err) {
    console.log(`uncover does not have read permissions for: ${args}`);
    exit(1);
  }
}

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
    console.log(projectId);

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

    canAccessR_OK(directory);
    writeFileSync(
      path.join(directory, Filenames.uncover),
      JSON.stringify({
        uncover: "enabled",
        projectId:
          projectId.match(".vercel/project.json") !== null
            ? ((): string => {
                canAccessR_OK(path.join(directory, projectId));
                const file = JSON.parse(
                  readFileSync(path.join(directory, projectId), {
                    encoding: "utf-8",
                  })
                );
                return file.projectId;
              })()
            : projectId,
        teamId: teamId.match(".vercel/project.json") !== null
          ? ((): string => {
              canAccessR_OK(path.join(directory, teamId));
              const file = JSON.parse(
                readFileSync(path.join(directory, teamId), {
                  encoding: "utf-8",
                })
              );
              return file.orgId;
            })()
          : teamId,
        // gitUserName: await (async (): string => {
        //   canAccessR_OK(path.join(directory, ".git"));
        //   const { stderr, stdout } = await execified("git config --list");
        //   if (stderr) exit(1);
        //   console.log(stdout.match(/user\.name=(.*)\n/)![1]);
        //   return stdout.match(/user\.name=(.*)\n/) === null
        //     ? null
        //     : stdout.match(/user\.name=(.*)\n/)![1];
        // })(),
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
          path.join(directory, Filenames.vercel),
          "\n#uncover\nuncover.json"
        );
      } else {
        console.log("adding gitignore and appending uncover.json");
        writeFileSync(
          path.join(directory, Filenames.vercel),
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

program.addCommand(await LinkCommand());
await program.parseAsync(process.argv);
