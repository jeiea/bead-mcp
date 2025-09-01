import { assertEquals } from "jsr:@std/assert@^1";
import { getCurrentBranch } from "./git_commands.ts";
import { whichGit } from "./which_git.ts";

Deno.test("getCurrentBranch", async () => {
  const git = await whichGit();
  const branch = await getCurrentBranch(git, ".");
  assertEquals(branch, "main");
});
