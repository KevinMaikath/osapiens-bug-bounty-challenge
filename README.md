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

The config should go under `react.transKeepBasicHtmlNodesFor` in `i18n.init()`, but react-i18next v11 reads its own
defaults separately and it was causing a new bug after fixing bug 3 ("Uncaught TypeError: Component is not a function").
I could've reverted to declaring the `components` prop in `<Trans>` but I tried setting this in `setDefaults()` from
`react-i18next` instead of `react.transKeepBasicHtmlNodesFor` seems to be the fix for that, maintaining the long-term
solution as I explained above.

## Bug 3 — User avatar not displaying in app bar

Found in `src/api/services/User/store.ts` and `src/components/AvatarMenu/index.tsx`

**Fix**:

The primary bug is a typo: `this.urser = result` in `getOwnUser()`. This was causing `user` to stay as `null` and
`user && user.eMail` in `AppHeader` was never met.

The second bug is that `AvatarMenu` was a plain function component, but it's rendered as a child of MUI's `Grow`
transition, which passes a ref to its child to drive an animation. Without `React.forwardRef`, that ref is null,
causing a crash. This wasn't crashing before the first fix becaus the `AvatarMenu` wasn't even being mounted.
Reference: https://mui.com/material-ui/guides/composition/#caveat-with-refs

As a minor good-practice detail, `StoreProvider` was instantiating `new Store()` directly in JSX
(`value={new Store()}`), which creates a fresh store on every render of the provider. Moved to
`useState(() => new Store())` to keep the reference stable. See "Additional changes" below for details.

## Bug 4 — Countdown accelerates on Fast Refresh (stacked intervals)

Found in `src/components/AppHeader/index.tsx:45`

**How to reproduce**: Hot reloading. Start the dev server, make any change in the code and save. React Fast Refresh
re-runs the effect without unmounting the component, so a second interval stacks on the first, making the counter
increment at 2x speed.

**Fix**: Return a cleanup function from `useEffect` that calls `clearInterval` on the interval ID. Fast Refresh calls
the cleanup before re-running the effect, so at most one interval is ever active.

Reference: [React docs — Synchronizing with
Effects, Cleanup](https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

# Additional changes

Non-bug improvements made along the way (like performance, good practices or latent issues).

## Stable `Store` instance in `StoreProvider`

Found in `src/api/services/User/index.tsx`

`StoreProvider` was passing `new Store()` directly in JSX as the context value, so a fresh instance was created on every
render. It only "worked" because the provider sits near the root and rarely re-renders.

**Fix**: switched to `useState(() => new Store())` to construct the store once per mount. The lazy form matters:
passing `new Store()` directly would still call the constructor on every render — React just discards the result after
the first.

Reference: [React docs —
`useState`, "Avoiding recreating the initial state"](https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state).
