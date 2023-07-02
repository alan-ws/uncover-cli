import { Command, Option } from "commander";
import { exit } from "node:process";
import path from "node:path";
import {
  appendFileSync,
  existsSync,
  lstatSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { access, constants } from "node:fs/promises";
import { execified } from "../utils";

async function fileExists<T>(dir: string, fileName: T): Promise<Map<T, boolean>> {
  return new Map().set(fileName, existsSync(path.join(dir, (fileName as string))))
}

async function handleUncover(args: string) {
  console.log("creating uncover.json")
  writeFileSync(
    path.join(args, "uncover.json"),
    JSON.stringify({
      uncover: "enabled",
      projectId: getProjectId() || "",
      teamId: getTeamId() || "",
      gitUserName: getGitUserName() ?? ""
    }),
    { encoding: "utf-8" }
  );
}

async function handleGitIgnore(value: Map<'uncover.json' | '.gitignore' | '.vercelignore', boolean>, args: string) {
  if (!value.get('.gitignore')) {
    console.log("Create .gitignore");
    writeFileSync(path.join(args, ".gitignore"), "#uncover\nuncover.json", {
      encoding: "utf-8",
    });
  } else {
    console.log("Add uncover.json to .gitignore");
    appendFileSync(
      path.join(args, ".gitignore"),
      "\n#uncover\nuncover.json"
    );
  }
}

async function handleVercelIgnore(value: Map<'uncover.json' | '.gitignore' | '.vercelignore', boolean>, args: string) {
  if (!value.get('.vercelignore')) {
    console.log("Create .vercelignore");
    writeFileSync(path.join(args, ".vercelignore"), "#uncover\nuncover.json", {
      encoding: "utf-8",
    });
  } else {
    console.log("Add uncover.json to .vercelignore");
    appendFileSync(
      path.join(args, ".vercelignore"),
      "\n#uncover\nuncover.json"
    );
  }
}

function canAccessR_OK(args: string) {
  try {
    access(args, constants.R_OK)
    console.log(`uncover can access: ${args}`)
  } catch (err) {
    console.log(`uncover does not have read permissions for: ${args}`)
    exit(1)
  }
}

function getProjectId() {
  canAccessR_OK(path.join(process.cwd(), '.vercel', 'project.json'))
  const file = JSON.parse(readFileSync(path.join(process.cwd(), '.vercel', 'project.json'), { encoding: 'utf-8' }))
  return file.projectId
}

function getTeamId() {
  canAccessR_OK(path.join(process.cwd(), '.vercel', 'project.json'))
  const file = JSON.parse(readFileSync(path.join(process.cwd(), '.vercel', 'project.json'), { encoding: 'utf-8' }))
  return file.orgId
}

async function getGitUserName() {
  canAccessR_OK(path.join(process.cwd(), '.git'))
  const { stderr, stdout } = await execified('git config --list')
  if (stderr) exit(1);
  console.log(stdout.match(/user\.name=(.*)\n/)![1])
  return stdout.match(/user\.name=(.*)\n/) === null ? null : stdout.match(/user\.name=(.*)\n/)![1]
}

export function link() {
  const program = new Command("link");
  program.description(
    "link uncover to vercel project.\nlinks to default hobby unless project ID provided or found in root directory"
  )

  const projectIdOption = new Option("-p --project-id [id]", "vercel project id")
  const patchOption = new Option("--patch", "patch .vercelignore and .gitignore with uncover.json")
  const directoryOption = new Option("-d --directory [directory]", "absolute path to vercel project")
  const teamIdOption = new Option("-t --team-id [id]", "vercel team id")

  projectIdOption.default("takes value from .vercel/project.json if present")
  projectIdOption.preset(getProjectId())
  projectIdOption.argParser(async (op) => {
    getGitUserName()
    console.log('pro', op)
  })

  patchOption.argParser(async () => {
    console.log('Patching .gitignore and .vercelignore')
    try {
      await Promise.all([
        handleGitIgnore(new Map().set('.gitignore', true), process.cwd()),
        handleVercelIgnore(new Map().set('.vercelignore', true), process.cwd())
      ])
    } catch (err) {
      console.error(err)
      exit(1)
    }
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
      fileExists<".gitignore">(args, ".gitignore"),
      fileExists<".vercelignore">(args, ".vercelignore"),
    ]);

    try {
      await Promise.all([
        handleUncover(args),
        handleGitIgnore(files[0], args),
        handleVercelIgnore(files[1], args)
      ])
    } catch (err) {
      console.error(err)
      exit(1)
    }
  })

  program.addOption(teamIdOption)
  program.addOption(projectIdOption)
  program.addOption(directoryOption)
  program.addOption(patchOption)

  return program;
}
