export const basic = (url: string) => `
import http from "k6/http";
import { sleep } from "k6";

export default function () {
    http.get("${url}");
    sleep(1);
}`