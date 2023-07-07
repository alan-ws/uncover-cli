import { delimiter } from "node:path";
import { access, constants } from "node:fs/promises";
import { exec } from "node:child_process";

export async function execute(filePath: string) {
    const envvars = process.env;
    const exts = (envvars.PATHEXT || "").split(delimiter).concat("");
    const bins = await Promise.all(
        exts.map(async (ext) => {
            try {
                await access(filePath + ext, constants.X_OK);
                return filePath + ext;
            } catch (err) {
                return undefined;
            }
        })
    );
    return bins.find((bin) => !!bin);
}
