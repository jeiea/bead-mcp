import { getCurrentBranch, runGitCommand } from "./git_commands.ts";
import { whichGit } from "./which_git.ts";

export const _internals = {
  extractRemotesFromConfig,
  getBranchUpstream,
  extractDefaultBranch,
};

export async function getGitRepoDefaultBranch(path: string) {
  const git = await whichGit();
  const currentBranch = await getCurrentBranch(git, path);
  return await getDefaultBranch(path, { git, sourceBranch: currentBranch });
}

export async function getDefaultBranch(
  path: string,
  { git, sourceBranch }: { git: string; sourceBranch: string },
) {
  const config = await runGitCommand(["config", "--list"], { git, cwd: path });
  const remotes = extractRemotesFromConfig(config);
  const firstRemote = remotes[0];
  if (!firstRemote) {
    throw new Error("no remote found");
  }

  const remote = getBranchUpstream(config, sourceBranch) ?? firstRemote;

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
