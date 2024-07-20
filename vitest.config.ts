/// <reference types="vitest" />
import { svelteTesting } from "@testing-library/svelte/vite";
import { getViteConfig } from "astro/config";

export default getViteConfig({
  plugins: [svelteTesting()],
  test: {
    environment: "jsdom",
    globals: true,
  },
});
