import { parseArgs } from "jsr:@std/cli@^1/parse-args";
import { getProvisionalPrChangesText } from "../src/get_provisional_pr_changes.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const args = parseArgs(Deno.args, {
    string: ["path"],
    alias: {
      path: "p",
      help: "h",
    },
    default: {
      path: ".",
    },
  });

  if (args.help) {
    console.log(`Usage: deno run --allow-all bin/get-pr-changes.ts [options]

Options:
  --path, -p <path>  Git repository path (default: current directory)
  --help, -h         Show this help message

Examples:
  deno run --allow-all bin/get-pr-changes.ts
  deno run --allow-all bin/get-pr-changes.ts --path=/path/to/repo
  deno run --allow-all bin/get-pr-changes.ts -p ~/project
`);
    Deno.exit(0);
  }

  try {
    const result = await getProvisionalPrChangesText(args.path);
    console.info(result);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : error}`);
    Deno.exit(1);
  }
}
