import { McpServer } from "npm:@modelcontextprotocol/sdk@^1/server/mcp.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk@^1/server/stdio.js";
import { z } from "npm:zod@^3";
import { getGitRepoDefaultBranch } from "./get_default_branch.ts";

export async function runServer() {
  const server = createServer();
  const transport = new StdioServerTransport();

  try {
    await server.connect(transport);
  } catch (error) {
    Deno.writeTextFile("error.log", `${error}\n`, { append: true });
  }

  return server;
}

export function createServer() {
  const server = new McpServer({
    name: "bead-mcp",
    version: "1.0.0",
  });

  server.registerTool(
    "get-default-branch",
    {
      title: "Get Default Branch",
      description: "Get the default branch of a git repository",
      annotations: {
        readOnlyHint: true,
        openWorldHint: true,
      },
      inputSchema: {
        path: z.string(),
      },
    },
    async (args) => {
      try {
        const defaultBranch = await getGitRepoDefaultBranch(args.path);
        return { content: [{ type: "text", text: defaultBranch }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error getting default branch: ${error}` }] };
      }
    },
  );

  return server;
}
