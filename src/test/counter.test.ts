import Counter from "@components/Counter.svelte";
import { assertT, click, getByRole, getByText, setup } from "./testing";

test("Counter and clicks", async () => {
  setup(Counter);
  await click(getByRole("button", "clicks: 0"));
  assertT(getByRole("button", "clicks: 1"), "show click count");
  assertT(getByText("clicks: 1"), "show click count");
});
