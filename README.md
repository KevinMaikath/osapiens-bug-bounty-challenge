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

## Bug 2 — "known" not displayed bold in intro text

Found in `src/pages/Home/index.tsx:54`

**Fix**: Use the `<Trans>` component from `react-i18next`, which understands inline markup and maps it to real
React/HTML elements, instead of using `t()`, which always returns a plain string.

Additionally, I added the tag `<b>` to react-i18next's `transKeepBasicHtmlNodesFor` list (in `src/i18n/i18n.tsx`). A
quick-win solution would have been to use the `components` prop of the `<Trans>` component, but I think this other
approach is better for the long term to avoid having to specify that same `component` prop every time `<b>` is used in a
translation.
