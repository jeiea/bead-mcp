import { which } from "jsr:@david/which@^0.4";

export async function whichGit() {
  const git = await which("git");
  if (!git) {
    throw new Error("git not found");
  }
  return git;
}
