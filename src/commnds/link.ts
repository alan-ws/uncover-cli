import { Separator, select } from "@inquirer/prompts";
import { Command, OptionValues } from "commander";
import { exit, prependOnceListener } from "node:process";
import { streamableExec } from "../utils";
import path from "node:path";
import { appendFileSync, existsSync, readFile, readFileSync, writeFileSync } from "node:fs";
import XDGAppPaths from "xdg-app-paths"

interface M extends Object, OptionValues { }

function defaultDirectory(value: string) {
    if (value === ".")
        return process.cwd()
    return value
}

async function fileExists(path: string) {
    return existsSync(path)
}

export function link() {
    const program = new Command('link')
    program
        .description('link uncover to vercel project')
        .option('-l --list', 'list domains for project')
        .option('-p --preview', 'list preview domains for project')
        .option('-t --token <token>', 'vercel authentication token')
        .option('-d --directory [directory]', 'current (.) or absolute path to vercel project', defaultDirectory, ".")
        .action(async (op: M) => {
            if (Object.entries(op).length < 1) {
                program.outputHelp()
                // import { Separator, select } from "@inquirer/prompts";
                // maybe ask if the user would like to link the project and output help on no
            }

            const vercelDirectories = XDGAppPaths('com.vercel.cli').dataDirs();
            const { token } = JSON.parse(readFileSync(path.join(vercelDirectories[0].replace('xdg.data\\com.vercel', 'com.vercel.cli'), 'Data', 'auth.json'), {
                encoding: 'utf-8',
            }))
            console.log(token)

            const res = await fetch("https://api.vercel.com/v9/projects?teamId=team_4HuspICVxHSNsdkf6gZuHeHJ", {
                method: 'GET',
                headers: {
                    authorization: `bearer ${token}`,
                    'content-type': 'application/json'
                }
            })

            console.log(await res.json())

            if (op.hasOwnProperty('directory')) {
                let dir = op.directory
                if (dir === true) dir = process.cwd()
                const files = await Promise.all([fileExists(path.join(dir, 'uncover.json')), fileExists(path.join(dir, '.gitignore')), fileExists(path.join(dir, '.vercelignore'))])
                if (files[0] === false) {
                    console.log('linking directory\n')
                    console.log('Create uncover.json')
                    writeFileSync(path.join(dir, 'uncover.json'), JSON.stringify({ uncover: 'enabled' }), { encoding: 'utf-8' })

                    if (files[1] === false) { console.log('Create .gitignore'); writeFileSync(path.join(dir, '.gitignore'), 'uncover.json', { encoding: 'utf-8' }) }
                    else { console.log('Add uncover.json to .gitignore'); appendFileSync(path.join(dir, '.gitignore'), '\n#uncover\n uncover.json') }
                    if (files[2] === false) { console.log('Create .vercelignore'); writeFileSync(path.join(dir, '.vercelignore'), 'uncover.json', { encoding: 'utf-8' }) }
                    else { console.log('Add uncover.json to .vercelignore'); appendFileSync(path.join(dir, '.gitignore'), '\n#uncover\n uncover.json') }
                    console.log("\n")
                } else console.log('Project is already linked. uncover.json is present at the root of directory\n')

            }
        })
    return program
}
