import { getProvisionalPrChanges } from "./get_provisional_pr_changes.ts";

Deno.test("getProvisionalPrChanges", async () => {
  const changes = await getProvisionalPrChanges(".");
  console.info(changes);
});
