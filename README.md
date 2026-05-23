# osapiens-bug-bounty-challenge

Created with CodeSandbox

## Notes

Used Node v16 because the package.json scripts require `NODE_OPTIONS=--openssl-legacy-provider` and used NPM over PNPM
because otherwise sub-dependencies can't be used without declaring them in the package.json, and tweaking any of that
wasn't part of this challenge.

`eslintConfig` had to be added to package.json to avoid ESLint errors when compiling, avoiding a conflict between the
default `babel-eslint` and the TypeScript overrides.

# Bug log

## Bug 1 — Missing `key` prop in list (Console warning)

Found in `src/pages/Home/index.tsx:61`

**Fix**: Added the missing `key` prop to `ListItem` component. Using the `.map` index is enough here, given that the
list is constant.