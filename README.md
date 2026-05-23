# osapiens-bug-bounty-challenge

Created with CodeSandbox

## Notes

Used Node v16 because the package.json scripts require `NODE_OPTIONS=--openssl-legacy-provider` and used NPM over PNPM
because otherwise sub-dependencies can't be used without declaring them in the package.json, and tweaking any of that
wasn't part of this challenge.

`eslintConfig` had to be added to package.json to avoid ESLint errors when compiling, avoiding a conflict between the
default `babel-eslint` and the TypeScript overrides.
