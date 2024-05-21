# Bootstrap

```bash
pnpm create astro@latest
```

## Prettier

```bash
pnpm install -D @prettier/plugin-xml prettier prettier-plugin-astro prettier-plugin-astro prettier-plugin-svelte prettier-plugin-tailwindcss
```

```bash
pnpm dlx mrm@2 lint-staged
```

package.json:

```json
{
  "lint-staged": {
    "**/*": "prettier --write --ignore-unknown"
  },
  "prettier": {
    "plugins": ["@prettier/plugin-xml", "prettier-plugin-astro", "prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
    "printWidth": 160,
    "xmlQuoteAttributes": "double",
    "xmlWhitespaceSensitivity": "ignore"
  }
}
```

## Integrations

```bash
pnpm exec astro add svelte tailwind
pnpm install -D daisyui@latest svelte@next
```
