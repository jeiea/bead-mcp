import { getDefaultBranch } from "./get_default_branch.ts";
import { getCurrentBranch, runGitCommand } from "./git_commands.ts";
import { whichGit } from "./which_git.ts";

export const _internals = { cutTextLines };

export async function getProvisionalPrChanges(
  path: string,
  { cursor, maxLines }: { cursor?: string; maxLines?: number },
) {
  const git = await whichGit();

  const currentBranch = await getCurrentBranch(git, path);
  const defaultBranch = await getDefaultBranch(path, { git, sourceBranch: currentBranch });

  const params = { git, cwd: path, trimEnd: true };
  const mergeBase = await runGitCommand(["merge-base", defaultBranch, currentBranch], params);
  const changes = await runGitCommand(["diff", mergeBase, currentBranch], params);

  return cutTextLines(changes, { cursor, maxLines });
}

function cutTextLines(text: string, { cursor, maxLines }: { cursor?: string; maxLines?: number }) {
  const lines = text.split("\n");
  const startLine = cursor ? parseInt(cursor, 10) : undefined;
  const start = (startLine ?? 1) - 1;
  const end = maxLines ? start + maxLines : lines.length;
  const parts = lines.slice(start, end);
  const hasNext = end < lines.length;

  return {
    text: parts.join("\n"),
    nextCursor: hasNext ? `${end + 1}` : undefined,
  };
}
