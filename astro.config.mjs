import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  integrations: [svelte(), tailwind(), mdx()],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
