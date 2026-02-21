# Frontend component splitting guide

The frontend has several large components and some inline templates. The goal is to split components for readability, reuse, and easier refactors (especially while migrating to TanStack Query).

## When to split a component

Split when you see any of these:

- file is consistently > ~200–300 lines
- component mixes concerns (data fetching + layout + complex UI widgets)
- repeated UI blocks across screens
- inline templates with lots of markup
- multiple dialogs/overlays managed in one component

## How to split (project-friendly approach)

1. **Extract presentational components**
   - Inputs: plain data
   - Outputs: events
   - No API calls
   - No QueryClient usage

2. **Keep container components thin**
   - Owns TanStack Query hooks
   - Maps query results to view models
   - Wires events to mutations

3. **Prefer feature-local folders**

Example:

```
modules/main/calendar/
  calendar.component.ts            (container)
  components/
    calendar-grid/
    calendar-grid.component.ts     (presentational)
    calendar-day-names/
    ...
```

4. **Avoid deep Input drilling**

If many nested components need the same server data:

- prefer colocated queries in the container and pass only what’s needed
- or use TanStack Query in the subcomponent if it truly owns that data

5. **Keep templates external**

Inline templates are fine for tiny components, but for maintainability prefer:

- `templateUrl` + `styleUrls`

## Refactor safety checklist

- keep public component API stable (Inputs/Outputs) while extracting
- move logic in small steps; verify UI still renders
- avoid mixing the TanStack Query migration with large UI rewrites in one change

## Optional testing (nice-to-have)

Even without a full test plan, extracted presentational components are easier to test later.
