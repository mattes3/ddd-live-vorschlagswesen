# Using project references with the TypeScript compiler

## Why use project references?

See the blog post [Migrating Large TypeScript Codebases To Project References](https://shopify.engineering/migrating-large-typescript-codebases-project-references) by Shopify.

## How to generate the references automatically

```sh
pnpm tsx ./scripts/auto-generate-tsconfig-files.ts
```
## How to check for correctness

To check whether all references are correct, invoke this command from the root of this repo:

```sh
pnpm tsc -b config/typescript/tsconfig.project-references.json
```

Then, add the `tsconfig*.json` files to git and commit them.
