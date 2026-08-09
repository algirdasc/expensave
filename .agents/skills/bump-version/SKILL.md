---
name: bump-version
description: Use when asked to bump the Expensave version, prepare a release, or decide whether the next version is patch, minor, or major.
---

# Bump Version

Project version lives in three files that must stay in sync:

- `frontend/package.json` — source of truth (UI version labels read it)
- `frontend/package-lock.json` — updated automatically by `npm version`
- `backend/.env` — `APP_VERSION=x.y.z`, synced automatically (see below)

## Decide the bump type

List what landed since the last bump:

```bash
git log --oneline $(git log --oneline --grep="bump version" -1 --format=%H)..HEAD
```

Project semver convention (see `devops-release`):

- **major**: breaking changes or major features
- **minor**: significant updates and bugfixes (`feat:` commits, larger fix batches)
- **patch**: small insignificant change or dependency-only update

On mixed sets, the highest level wins. Tell the user which type you picked and why before running the bump.

## Run the bump

Do it on a branch — the bump commit goes through a PR like any other change:

```bash
git checkout -b chore/bump-version-X.Y.Z   # branch from an up-to-date main
source ~/.nvm/nvm.sh && nvm use   # repo pins Node in .nvmrc; nvm needs sourcing in non-interactive shells
cd frontend
npm version <patch|minor|major> -m "chore: bump version to %s"
```

`npm version` does everything in one step:

- updates `frontend/package.json` and `frontend/package-lock.json`
- runs the `version` lifecycle script (`frontend/update-version.js`), which writes the new `APP_VERSION` into `backend/.env` and stages it with `git add`
- in a repo where `frontend/.git` exists, also commits all three files as `chore: bump version to X.Y.Z` and creates local tag `vX.Y.Z`

**Monorepo gotcha:** npm's git detection stats `frontend/.git`, which does not exist in this repo, so `npm version` updates the files and runs the hook but silently skips the commit and tag (npm log says `Not tagging: not in a git repo or no git cmd`). Finish the git step by hand after every bump — from the repo root (the bump commands above leave you in `frontend/`):

```bash
cd "$(git rev-parse --show-toplevel)"
V=$(node -p "require('./frontend/package.json').version")
git add frontend/package.json frontend/package-lock.json   # backend/.env is already staged by the hook
git commit -m "chore: bump version to $V"
git tag -a "v$V" -m "chore: bump version to $V"
```

Never edit the version fields by hand and never bump without the hook — a `backend/.env` that drifts from `package.json` ships a wrong version label.

## Verify

Two silent failures have bitten this flow — npm skipping the commit/tag, and an IDE/tool checking out `main` mid-run so the commit lands there instead of the branch. Always verify before moving on:

```bash
git branch --show-current        # the bump branch, NOT main
git tag --points-at $(git log -1 --format=%H --grep="bump version")   # vX.Y.Z, sitting on the bump commit
grep -m1 '"version"' frontend/package.json && grep APP_VERSION backend/.env   # same version in both
git status --short               # clean tree
```

If the bump commit landed on `main` (external branch switch): `git branch -f chore/bump-version-X.Y.Z main && git reset --hard origin/main && git checkout chore/bump-version-X.Y.Z`.

## After the bump

- Push the branch and open a PR: `git push -u origin chore/bump-version-X.Y.Z`. Never push the bump directly to `main`.
- Bump PRs are squash-merged, so the local `vX.Y.Z` tag points at a branch commit that will not land on `main` — it only marks the bump commit during review. Do not push it.
- Tagging `main` triggers the release Docker workflow, so it is a release decision, not part of every bump. Only when the user asks to release, after the PR merges:

```bash
git checkout main && git pull
git tag -d vX.Y.Z                            # drop the stale branch-commit marker
git tag -a vX.Y.Z -m "chore: bump version to X.Y.Z"   # on the merge commit
git push origin vX.Y.Z
```
