# Bootstrap

```bash
pnpm create astro@latest
```

## Prettier

```bash
pnpm install -D @prettier/plugin-xml prettier prettier-plugin-astro prettier-plugin-astro prettier-plugin-svelte prettier-plugin-tailwindcss
```

package.json:

```json
{
  "prettier": {
    "plugins": ["@prettier/plugin-xml", "prettier-plugin-astro", "prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
    "printWidth": 160,
    "xmlQuoteAttributes": "double",
    "xmlWhitespaceSensitivity": "ignore"
  }
}
```

## Lint Staged

```bash
pnpm install -D husky lint-staged
pnpm exec husky init
echo "pnpm exec lint-staged" > .husky/pre-commit
```

package.json:

```json
{
  "lint-staged": {
    "**/*": "prettier --write --ignore-unknown"
  }
}
```

## Integrations

```bash
pnpm exec astro add svelte tailwind
pnpm install -D daisyui@latest svelte@next
```
