# mattrabe.com

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting started on local

1. Ensure proper node.js version. See section below.
1. Run `npm install` to install dependencies.

## Running the app on local

* `npm run dev`

## Linting and Testing

### Lint

`pnpm lint`

## Deploying

This app is deployed using Vercel automatically, any time a PR is merged into the `main` branch.

See Vercel project here: https://vercel.com/matt-rabe/mattrabe-com

## Ensuring proper node.js version

This monorepo requires a specific node.js version, set in package.json and .nvmrc.

[Install nvm](https://github.com/nvm-sh/nvm) in order to maintain multiple node versions on a single machine.

### Automatically using the spec'd version

To automatically keep your node version in sync, make your shell automatically look for and run .nvmrc when you change directories: https://github.com/nvm-sh/nvm#deeper-shell-integration

### Manually using the spec'd version

Run `nvm use` every time you open a new terminal or change directory into this repository.
