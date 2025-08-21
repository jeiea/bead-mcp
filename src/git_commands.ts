export async function runGitCommand(
  args: string[],
  { git, cwd, trimEnd = false }: { git: string; cwd: string; trimEnd?: boolean },
) {
  const command = new Deno.Command(git, { args, cwd });
  const output = await command.output();

  if (output.success) {
    const stdout = new TextDecoder().decode(output.stdout);
    return trimEnd ? stdout.trimEnd() : stdout;
  }

  const stderr = new TextDecoder().decode(output.stderr);
  throw new Error(`${git} ${args.join(" ")} exited with code ${output.code}\n${stderr}`);
}

export async function getCurrentBranch(git: string, cwd: string) {
  const params = { git, cwd, trimEnd: true };
  return await runGitCommand(["rev-parse", "--abbrev-ref=strict", "HEAD"], params);
}
