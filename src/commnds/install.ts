import { Separator, select } from "@inquirer/prompts";
import { Command, OptionValues } from "commander";
import { exit } from "node:process";
import { streamableExec } from "../utils";

interface M extends Object, OptionValues { }

export function install() {
    const program = new Command('install')
    program
        .description('default non-interactive installation')
        .option('-i --interactive', 'install from binary and select packages')
        .action(async (op: M) => {
            if (program.args.length > 1) {
                throw Error('install does not accept arguements')
            }

            if (op.hasOwnProperty('interactive')) {
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
