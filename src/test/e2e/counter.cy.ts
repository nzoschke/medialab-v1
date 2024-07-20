import { assertT, click, findByRole, findByText, setup } from "./testing";

it("Counter and clicks", () => {
  setup("/counter");
  click(findByRole("button", "clicks: 0"));
  assertT(findByRole("button", "clicks: 1"), "show click count");
  assertT(findByText("clicks: 1"), "show click count");
});
