import { assertEquals, assertExists } from "jsr:@std/assert@^1";
import { _internals, getProvisionalPrChanges } from "./get_provisional_pr_changes.ts";

const { cutTextLines } = _internals;

Deno.test("getProvisionalPrChanges - basic functionality", async () => {
  const result = await getProvisionalPrChanges(".", {});
  assertExists(result.text);
  assertEquals(typeof result.text, "string");

  // nextCursor should be undefined or a string
  if (result.nextCursor !== undefined) {
    assertEquals(typeof result.nextCursor, "string");
  }
});

Deno.test("cutTextLines - basic functionality", () => {
  const text = "line1\nline2\nline3\nline4\nline5";
  const result = cutTextLines(text, {});

  assertEquals(result.text, text);
  assertEquals(result.nextCursor, undefined);
});

Deno.test("cutTextLines - with cursor", () => {
  const text = "line1\nline2\nline3\nline4\nline5";
  const result = cutTextLines(text, { cursor: "3" });

  assertEquals(result.text, "line3\nline4\nline5");
  assertEquals(result.nextCursor, undefined);
});

Deno.test("cutTextLines - with maxLines", () => {
  const text = "line1\nline2\nline3\nline4\nline5";
  const result = cutTextLines(text, { maxLines: 2 });

  assertEquals(result.text, "line1\nline2");
  assertEquals(result.nextCursor, "3");
});

Deno.test("cutTextLines - with cursor and maxLines", () => {
  const text = "line1\nline2\nline3\nline4\nline5";
  const result = cutTextLines(text, { cursor: "2", maxLines: 2 });

  assertEquals(result.text, "line2\nline3");
  assertEquals(result.nextCursor, "4");
});

Deno.test("cutTextLines - cursor beyond end", () => {
  const text = "line1\nline2\nline3";
  const result = cutTextLines(text, { cursor: "10" });

  assertEquals(result.text, "");
  assertEquals(result.nextCursor, undefined);
});

Deno.test("cutTextLines - empty text", () => {
  const result = cutTextLines("", {});

  assertEquals(result.text, "");
  assertEquals(result.nextCursor, undefined);
});

Deno.test("cutTextLines - single line with maxLines", () => {
  const text = "single line";
  const result = cutTextLines(text, { maxLines: 5 });

  assertEquals(result.text, "single line");
  assertEquals(result.nextCursor, undefined);
});

Deno.test("cutTextLines - exact boundary", () => {
  const text = "line1\nline2\nline3";
  const result = cutTextLines(text, { maxLines: 3 });

  assertEquals(result.text, text);
  assertEquals(result.nextCursor, undefined);
});
