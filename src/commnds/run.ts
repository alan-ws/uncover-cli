// const vercelDirectories = XDGAppPaths("com.vercel.cli").dataDirs();
// let token: string | null = null;
// if (process.platform === "win32") {
//   token = JSON.parse(
//     readFileSync(
//       path.join(
//         vercelDirectories[0].replace("xdg.data\\com.vercel", "com.vercel.cli"),
//         "Data",
//         "auth.json"
//       ),
//       {
//         encoding: "utf-8",
//       }
//     )
//   ).token;
// }

// if (process.platform === "darwin") {
//   token = JSON.parse(
//     readFileSync(
//       path.join(
//         vercelDirectories[0].replace("/com.vercel", "/com.vercel.cli/"),
//         "auth.json"
//       ),
//       {
//         encoding: "utf-8",
//       }
//     )
//   ).token;
// }

// if (token !== null) {
//   const res = await fetch(
//     "https://api.vercel.com/v9/projects?teamId=team_4HuspICVxHSNsdkf6gZuHeHJ",
//     {
//       method: "GET",
//       headers: {
//         authorization: `bearer ${token}`,
//         "content-type": "application/json",
//       },
//     }
//   );
// }
