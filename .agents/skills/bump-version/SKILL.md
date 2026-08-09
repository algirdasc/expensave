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

```bash
source ~/.nvm/nvm.sh && nvm use   # repo pins Node in .nvmrc; nvm needs sourcing in non-interactive shells
cd frontend
npm version <patch|minor|major> -m "chore: bump version to %s"
```

`npm version` does everything in one step:

- updates `frontend/package.json` and `frontend/package-lock.json`
- runs the `version` lifecycle script (`frontend/update-version.js`), which writes the new `APP_VERSION` into `backend/.env` and stages it with `git add`
- commits all three files as `chore: bump version to X.Y.Z` and creates local tag `vX.Y.Z`

Never edit the version fields by hand and never bump without the hook — a `backend/.env` that drifts from `package.json` ships a wrong version label.

## After the bump

- Do not push directly to `main` — the bump commit belongs on a branch/PR like any other change.
- The `vX.Y.Z` tag is local. Push it (`git push origin vX.Y.Z`) or recreate it on `main` after the PR merges, only when the user asks — tagging triggers the release Docker workflow, so it is a release decision, not part of every bump.
