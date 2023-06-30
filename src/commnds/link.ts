import { Separator, select } from "@inquirer/prompts";
import { Command, Option, OptionValues } from "commander";
import { exit, prependOnceListener } from "node:process";
import { streamableExec } from "../utils";
import path, { delimiter } from "node:path";
import {
  appendFileSync,
  existsSync,
  lstatSync,
  readFile,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import XDGAppPaths from "xdg-app-paths";
import { homedir, platform } from "node:os";
import { access, constants } from "node:fs/promises";

interface M extends Object, OptionValues { }

function defaultDirectory(value: string) {
  if (value === ".") return process.cwd();
  return value;
}

async function fileExists<T>(dir: string, fileName: T): Promise<Map<T, boolean>> {
  return new Map().set(fileName, existsSync(path.join(dir, (fileName as string))))
}

async function handle(value: Map<'uncover.json' | '.gitignore' | '.vercelignore', boolean>, args: string) {
  if (value.has("uncover.json")) {
    console.log("creating uncover.json")
    writeFileSync(
      path.join(args, "uncover.json"),
      JSON.stringify({ uncover: "enabled" }),
      { encoding: "utf-8" }
    );
  }
}

export function link() {
  const program = new Command("link");
  program.description(
    "link uncover to vercel project.\nlinks to default hobby unless project ID provided or found in root directory"
  )

  const projectIdOption = new Option("-p --project-id <id>", "vercel project id")
  const directoryOption = new Option("-d --directory [directory]", "absolute path to vercel project")

  projectIdOption.argParser(async (op) => {
    console.log('pro', op)
  })

  directoryOption.default(process.cwd(), "takes current root directory")
  directoryOption.preset(process.cwd())
  directoryOption.argParser(async (args) => {
    console.log(`Attempting to link to directory: ${args}`)

    if ((await fileExists(args, "uncover.json")).get("uncover.json")) {
      console.log("Directory already linked")
      console.log("Ensure uncover.json is added to .gitignore and .vercelignore")
      console.log("Run uncover link --patch to add uncover.json to those files")
      exit(0);
    }

    try {
      lstatSync(args).isDirectory()
      console.log(`${args} is a directory`)
    } catch (err) {
      console.error(`${args} is not a directory`)
      exit(1)
    }

    try {
      access(args, constants.R_OK)
      console.log(`uncover can access directory`)
    } catch (err) {
      console.log(`uncover does not have read permissions for: ${args}`)
      exit(1)
    }

    const files: Map<'uncover.json' | '.gitignore' | '.vercelignore', boolean>[] = await Promise.all([
      fileExists<"uncover.json">(args, "uncover.json"),
      fileExists<".gitignore">(args, ".gitignore"),
      fileExists<".vercelignore">(args, ".vercelignore"),
    ]);

    await Promise.all(files.flatMap((value: Map<'uncover.json' | '.gitignore' | '.vercelignore', boolean>) => handle(value, args)))

    // files.find((value: Map<'uncover.json' | '.gitignore' | '.vercelignore', boolean>) => value.has())
    // for (let name of ['uncover.json', '.gitignore', '.vercelignore']) {
    //   for (let file of files) {
    //     file.has
    //   }
    // }
  })

  program.addOption(projectIdOption)
  program.addOption(directoryOption)

  // .action(async (op: M) => {
  //   if (Object.entries(op).length < 1) {
  //     program.outputHelp();
  //     // import { Separator, select } from "@inquirer/prompts";
  //     // maybe ask if the user would like to link the project and output help on no
  //   }

  //   if (op.hasOwnProperty("projectId")) {
  //     console.log(op.projectId);
  //   }

  // if (op.hasOwnProperty("directory")) {
  //   let dir = op.directory;
  //   if (dir === true) dir = process.cwd();

  //   if (files[0] === false) {
  //     console.log("linking directory\n");
  //     console.log("Create uncover.json");


  //     if (files[1] === false) {
  //       console.log("Create .gitignore");
  //       writeFileSync(path.join(dir, ".gitignore"), "uncover.json", {
  //         encoding: "utf-8",
  //       });
  //     } else {
  //       console.log("Add uncover.json to .gitignore");
  //       appendFileSync(
  //         path.join(dir, ".gitignore"),
  //         "\n#uncover\nuncover.json"
  //       );
  //     }
  //     if (files[2] === false) {
  //       console.log("Create .vercelignore");
  //       writeFileSync(path.join(dir, ".vercelignore"), "uncover.json", {
  //         encoding: "utf-8",
  //       });
  //     } else {
  //       console.log("Add uncover.json to .vercelignore");
  //       appendFileSync(
  //         path.join(dir, ".gitignore"),
  //         "\n#uncover\nuncover.json"
  //       );
  //     }
  //     console.log("\n");
  //   } else
  //     console.log(
  //       "Project is already linked. uncover.json is present at the root of directory\n"
  //     );
  // }
  // });
  return program;
}
