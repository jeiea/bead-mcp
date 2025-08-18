import { assertEquals, assertRejects } from "jsr:@std/assert@^1";
import { restore, stub } from "jsr:@std/testing@^1/mock";
import { getGitRepoDefaultBranch } from "./get_default_branch.ts";

Deno.test("returns default branch when git command succeeds", async () => {
  stub(Deno, "Command", () =>
    mockCommand(`* remote origin
  Fetch URL: https://github.com/example/repo.git
  Push  URL: https://github.com/example/repo.git
  HEAD branch: main
  Remote branches:
    develop tracked
    main    tracked`),
  );

  try {
    const result = await getGitRepoDefaultBranch("/fake/path");
    assertEquals(result, "main");
  } finally {
    restore();
  }
});

Deno.test("returns master when it's the default branch", async () => {
  stub(Deno, "Command", () =>
    mockCommand(`* remote origin
  Fetch URL: https://github.com/example/repo.git
  Push  URL: https://github.com/example/repo.git
  HEAD branch: master
  Remote branches:
    develop tracked
    master  tracked`),
  );

  try {
    const result = await getGitRepoDefaultBranch("/fake/path");
    assertEquals(result, "master");
  } finally {
    restore();
  }
});

Deno.test("throws error when default branch not found", async () => {
  stub(Deno, "Command", () =>
    mockCommand(`* remote origin
  Fetch URL: https://github.com/example/repo.git
  Push  URL: https://github.com/example/repo.git
  Remote branches:
    develop tracked`),
  );

  try {
    await assertRejects(
      async () => await getGitRepoDefaultBranch("/fake/path"),
      Error,
      "default branch not found",
    );
  } finally {
    restore();
  }
});

Deno.test("handles custom branch names", async () => {
  stub(Deno, "Command", () =>
    mockCommand(`* remote origin
  Fetch URL: https://github.com/example/repo.git
  Push  URL: https://github.com/example/repo.git
  HEAD branch: production
  Remote branches:
    develop tracked
    production tracked`),
  );

  try {
    const result = await getGitRepoDefaultBranch("/fake/path");
    assertEquals(result, "production");
  } finally {
    restore();
  }
});

Deno.test("throws error when git command fails", async () => {
  stub(Deno, "Command", () =>
    mockCommand(
      "fatal: 'origin' does not appear to be a git repository",
      128,
      false,
    ),
  );

  try {
    await assertRejects(
      async () => await getGitRepoDefaultBranch("/fake/path"),
      Error,
      "default branch not found",
    );
  } finally {
    restore();
  }
});

function mockCommand(result: string, code = 0, success = true) {
  return {
    spawn: () => ({
      output: () =>
        Promise.resolve({
          stdout: new TextEncoder().encode(result),
          stderr: new Uint8Array(),
          code,
          success,
        }),
    }),
  };
}
