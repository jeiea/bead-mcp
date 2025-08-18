import { assertEquals } from "jsr:@std/assert@^1";
import { afterAll, beforeAll, describe, it } from "jsr:@std/testing@^1/bdd";
import { Client } from "npm:@modelcontextprotocol/sdk@^1/client/index.js";
import { StdioClientTransport } from "npm:@modelcontextprotocol/sdk@^1/client/stdio.js";

describe("MCP Server", () => {
  let client: Client;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    transport = new StdioClientTransport({
      command: "deno",
      args: ["run", "-A", "./bin/main.ts"],
      env: {
        ...Deno.env.toObject(),
        WORKSPACE_FOLDER_PATHS: Deno.cwd(),
      },
    });

    client = new Client({
      name: "example-client",
      version: "1.0.0",
    });
    await client.connect(transport);
  });

  afterAll(async () => {
    await Promise.all([
      new Promise<void>((resolve) => {
        client.onclose = () => resolve();
        client.close();
      }),
      new Promise<void>((resolve) => {
        transport.onclose = () => resolve();
        transport.close();
      }),
    ]);
  });

  it("should be able to connect to the server", async () => {
    const tools = await client.listTools();
    assertEquals(tools.tools.length, 1);
    assertEquals(tools.tools[0].name, "ping");
  });
});
