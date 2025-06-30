# TRT Planner

## Overview

TRT Planner is a self‑hosted medical tracking app built with **React** and **TypeScript** using Vite. It stores all data locally in the browser and requires no backend services. The app lets you configure medications and plan upcoming doses through interactive calendars.

## Tech Stack

- React 19 + TypeScript
- Vite for build and dev server
- Redux Toolkit with redux‑persist
- react‑router for navigation
- react‑icons for UI icons

## Features

### Configuration

- Add injectable or oral medications
- Reorder, disable or delete entries
- All settings are saved to `localStorage`
- "Delete All" button wipes all saved data with confirmation
- Future: info buttons will show medication summaries

### Injection Schedule

- Dynamic calendar per enabled injectable
- Frequency options: every day, every other day (start today or tomorrow), or specific days of the week
- Apply or reset schedule settings per medication
- Responsive: two months on desktop, one month on mobile

### Oral Schedule

- Simple list of medications with target date
- Entries can be disabled or deleted
- Saved to `localStorage` just like injection schedules

## Project Structure

```
src/
  assets/      # images and icons
  hooks/       # custom hooks (e.g. useIsMobile)
  layout/      # shared layout components such as Sidebar
  pages/       # page components: Config, InjectionSchedule, OralSchedule, etc.
  slices/      # Redux slices
  store/       # Redux store configuration
  version.ts   # current application version
```

## Dev Setup

Run the setup script once:

```bash
npm run setup
```

After that the usual Vite scripts are available:

```bash
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview production build
npm run lint      # run ESLint
npm run format    # run Prettier
```

## Versioning & Changelog

The current version is tracked in `src/version.ts`. Each commit bumps the patch number and appends an entry to both **CHANGELOG.md** and **README.md**.

## Privacy

TRT Planner does not send data anywhere. All configuration and schedules are stored in the browser via `localStorage`.

## Author

The TRT Planner team

## Changelog

- 2025-06-29 20:11 · Unspecified task · v0.0.0004
- 2025-06-29 20:14 · Extend Config page to record injectables · v0.0.0005
- 2025-06-29 20:54 · Unspecified task · v0.0.0006
- 2025-06-29 21:09 · Unspecified task · v0.0.0008
- 2025-06-29 21:26 · Unspecified task · v0.0.0009
- 2025-06-29 21:26 · Improve layout and UI for dynamic injectable list on Config page · v0.0.0010
- 2025-06-29 21:47 · Unspecified task · v0.0.0011
- 2025-06-29 22:03 · Improve layout and UI for dynamic injectable list on Config page · v0.0.0012
- 2025-06-29 22:02 · Unspecified task · v0.0.0013
- 2025-06-29 22:11 · Add Delete All button with confirmation to clear config and injectable data · v0.0.0014
- 2025-06-29 22:17 · Unspecified task · v0.0.0015
- 2025-06-29 22:18 · Simplify config layout and add oral medication support · v0.0.0016
- 2025-06-29 22:34 · Unspecified task · v0.0.0017
- 2025-06-29 22:46 · Align Injection Schedule layout with General Configuration styling · v0.0.0018
- 2025-06-29 22:46 · Unspecified task · v0.0.0019
- 2025-06-29 22:49 · Add Oral Schedule page and conditional sidebar visibility based on enabled medications · v0.0.0020
- 2025-06-29 22:56 · Unspecified task · v0.0.0021
- 2025-06-29 22:59 · Conditionally display schedule pages in sidebar based on enabled medication entries · v0.0.0022
- 2025-06-29 23:34 · Unspecified task · v0.0.0023
- 2025-06-29 23:37 · Display a calendar for each enabled injectable medication · v0.0.0024
- 2025-06-29 23:52 · Unspecified task · v0.0.0025
- 2025-06-29 23:54 · Improve visual separation between medication calendar blocks on Injection Schedule page · v0.0.0026
- 2025-06-30 00:16 · Unspecified task · v0.0.0027
- 2025-06-30 00:18 · Make calendar view responsive: 2 months on desktop, 1 month on mobile · v0.0.0028
- 2025-06-30 00:25 · Unspecified task · v0.0.0029
- 2025-06-30 00:28 · Add configurable injection frequency logic with apply/reset controls for each medication section · v0.0.0030
- 2025-06-30 00:39 · Unspecified task · v0.0.0031
- 2025-06-30 00:40 · Tweak calendar visuals and UX for injection frequency controls · v0.0.0032
- 2025-06-30 00:57 · Unspecified task · v0.0.0033
- 2025-06-30 00:58 · Generate full README file describing app purpose, architecture, and usage · v0.0.0034
- 2025-06-30 01:03 · Unspecified task · v0.0.0035
- 2025-06-30 01:04 · End of Day 1 milestone · v0.1.0000
- 2025-06-30 14:43 · Unspecified task · v0.1.0001
- 2025-06-30 14:48 · Refactor injection schedule view to use horizontal drug tab navigation · v0.1.0002
