import { which } from "jsr:@david/which@^0.4";

export const _internals = {
  extractRemotesFromConfig,
  getBranchUpstream,
  extractDefaultBranch,
};

export async function getGitRepoDefaultBranch(path: string) {
  const git = await which("git");
  if (!git) {
    throw new Error("git not found");
  }

  const config = await runGitCommand(["config", "--list"], { git, cwd: path });
  const remotes = extractRemotesFromConfig(config);
  const firstRemote = remotes[0];
  if (!firstRemote) {
    throw new Error("no remote found");
  }

  const currentBranch = await runGitCommand(["rev-parse", "--abbrev-ref=strict", "HEAD"], {
    git,
    cwd: path,
  });

  const branchRemote = getBranchUpstream(config, currentBranch);
  const remote = branchRemote ?? firstRemote;

  const stdout = await runGitCommand(["remote", "show", remote], { git, cwd: path });
  const defaultBranch = extractDefaultBranch(stdout);
  if (!defaultBranch) {
    throw new Error("default branch not found");
  }

  return `refs/remotes/${remote}/${defaultBranch}`;
}

function extractRemotesFromConfig(config: string) {
  return [...config.matchAll(/^remote\.(.*)\.url=/gm).map((match) => match[1])];
}

function getBranchUpstream(config: string, currentBranch: string) {
  return config.match(new RegExp(`branch\.${RegExp.escape(currentBranch)}\.remote=(.*)`))?.[1];
}

function extractDefaultBranch(stdout: string) {
  return stdout.match(/HEAD branch: (.*)/)?.[1];
}

async function runGitCommand(args: string[], { git, cwd }: { git: string; cwd: string }) {
  const command = new Deno.Command(git, { args, cwd });
  const output = await command.output();
  const stdout = new TextDecoder().decode(output.stdout);
  return stdout;
}
