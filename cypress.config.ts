import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4321",
    specPattern: "src/test/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: false,
  },
});
