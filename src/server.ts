import { McpServer, ResourceTemplate } from "npm:@modelcontextprotocol/sdk@^1/server/mcp.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk@^1/server/stdio.js";
import { getGitRepoDefaultBranch } from "./get_default_branch.ts";

export async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

function createServer() {
  const server = new McpServer({
    name: "bead-mcp",
    version: "1.0.0",
  });

  server.registerResource(
    "git-repo-default-branch",
    new ResourceTemplate("resource://{path}/default-branch.txt", { list: undefined }),
    {
      title: "Git Repo Default Branch",
      description: "Get the default branch of a git repository",
      icon: "git",
      tags: ["git", "repository"],
      mimeType: "text/plain",
    },
    async (uri, { path }) => {
      console.log(`uri: ${uri}, path: ${path}`);
      const defaultBranch = await getGitRepoDefaultBranch(path as string);
      return { contents: [{ uri: `${uri}`, text: defaultBranch }] };
    },
  );

  server.registerTool(
    "ping",
    {
      title: "Ping",
      description: "A simple ping tool for testing",
    },
    async () => {
      return {
        content: [{ type: "text", text: "pong" }],
      };
    },
  );

  return server;
}
