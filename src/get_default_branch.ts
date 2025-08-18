import { which } from "jsr:@david/which@^0.4";

export async function getGitRepoDefaultBranch(path: string) {
  const git = await which("git");
  if (!git) {
    throw new Error("git not found");
  }

  const command = new Deno.Command(git, { args: ["remote", "show", "origin"], cwd: path });
  const process = command.spawn();
  const output = await process.output();
  const stdout = new TextDecoder().decode(output.stdout);
  const defaultBranch = stdout.match(/HEAD branch: (.*)/)?.[1];
  if (!defaultBranch) {
    throw new Error("default branch not found");
  }

  return defaultBranch;
}
