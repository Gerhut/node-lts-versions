import { Client, interceptors } from "undici";
import { parse } from "semver";

const client = new Client("https://nodejs.org").compose(
  interceptors.responseError({ throwOnError: true }),
);

const response = await client.request({
  method: "GET",
  path: "/dist/index.json",
});
const data = await response.body.json();

/** @type {Map<string, string[]>} */
const ltsVersions = new Map();
for (const { version, lts } of data) {
  if (lts === false) continue;

  if (!ltsVersions.has(lts)) {
    ltsVersions.set(lts, new Array());
  }

  ltsVersions.get(lts).push(version);
}

console.log("# Node LTS Versions");
console.log();

for (const [lts, versions] of ltsVersions) {
  const minimalVersion = versions
    .map((version) => parse(version))
    .reduce((acc, version) => {
      if (acc === null) return version;
      if (version.compare(acc) < 0) return version;
      return acc;
    }, null);
  console.log(`## Node.js ${minimalVersion.major} (${lts})`);
  console.log();
  console.log("```json");
  console.log(
    JSON.stringify(
      {
        engines: {
          node: `^${minimalVersion.version}`,
        },
      },
      null,
      2,
    ),
  );
  console.log("```");
  console.log();
}
