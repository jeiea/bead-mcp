import { assertEquals, assertGreater } from "jsr:@std/assert@^1";
import { Client } from "npm:@modelcontextprotocol/sdk@^1/client/index.js";
import { StdioClientTransport } from "npm:@modelcontextprotocol/sdk@^1/client/stdio.js";

Deno.test("should be able to connect to the server", async () => {
  const transport = new StdioClientTransport({
    command: "deno",
    args: ["run", "-A", "./bin/main.ts"],
    env: {
      ...Deno.env.toObject(),
      WORKSPACE_FOLDER_PATHS: Deno.cwd(),
    },
  });

  const client = new Client({
    name: "example-client",
    version: "1.0.0",
  });
  await client.connect(transport);

  const tools = await client.listTools();
  assertGreater(tools.tools.length, 0);
  assertEquals(tools.tools[0].name, "get-default-branch");

  await Promise.all([
    new Promise<void>((resolve) => {
      client.onclose = resolve;
      client.close();
    }),
    new Promise<void>((resolve) => {
      transport.onclose = resolve;
      transport.close();
    }),
  ]);
});
