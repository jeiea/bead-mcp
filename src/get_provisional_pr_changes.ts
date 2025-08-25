import { getDefaultBranch } from "./get_default_branch.ts";
import { getCurrentBranch, runGitCommand } from "./git_commands.ts";
import { whichGit } from "./which_git.ts";

export async function getProvisionalPrChanges(path: string) {
  const git = await whichGit();

  const currentBranch = await getCurrentBranch(git, path);
  const defaultBranch = await getDefaultBranch(path, { git, sourceBranch: currentBranch });

  const params = { git, cwd: path, trimEnd: true };
  const messages = await runGitCommand(
    ["log", "--oneline", `${defaultBranch}..${currentBranch}`],
    params,
  );
  const mergeBase = await runGitCommand(["merge-base", defaultBranch, currentBranch], params);
  const changes = await runGitCommand(["diff", `${mergeBase}...${currentBranch}`], params);
  return `# Commits:\n${messages}\n\n# Changes:\n${changes}`;
}
