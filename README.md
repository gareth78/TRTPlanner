# MediTrack

**MediTrack** is a medication scheduling and tracking app designed to support hormone therapy, peptide cycles, supplement regimens, and other long-term treatment plans. Built with Vite, React, Zustand, and Tailwind CSS.

## Features

- Customisable medication plans and dosing schedules
- EOD and cyclical schedule support
- Daily logging of symptoms, biomarkers, and effects
- Support for multiple medication types (e.g. TRT, HCG, peptides)
- Calendar and dosage visualisation
- Fast, responsive UI with persistent local storage

## Development

To run the app locally:

```bash
git clone https://github.com/gareth78/MediTrack.git
cd MediTrack
npm install
npm run dev
```

To build for production:

```bash
npm run build
```

To run tests:

```bash
npm run test
```

## Folder Structure

```
src/
├── components/     # UI components
├── config/         # Default schedules, settings
├── hooks/          # Custom React hooks
├── pages/          # App views
├── store/          # Zustand state management
├── utils/          # Utilities
├── version.ts      # App version
```

## Roadmap

Planned features:

- Reminder notifications (local or push)
- Export/import plans and logs
- Multi-user support
- Cloud sync option
- Modal lookups for medication info (Wikipedia integration)
- Printable PDF reports

## Contributing

Pull requests welcome! For larger changes, please open an issue first to discuss proposed improvements or features.

## Version

Current version: `0.1.0047`

<!-- Minor updates (0.1.0000+) will be tracked in CHANGELOG.md -->

## Changelog

- 2025-07-01 14:35 · Unspecified task · v0.1.0044
- 2025-07-01 15:13 · Unspecified task · v0.1.0045
- 2025-07-01 15:42 · Unspecified task · v0.1.0046
- 2025-07-01 15:44 · Redesign login screen to match modern gradient layout with MediTrack logo and styled inputs · v0.1.0047
- 2025-07-01 19:52 · Unspecified task · v0.1.0048
- 2025-07-01 21:52 · Unspecified task · v0.1.0049
- 2025-07-01 22:45 · Unspecified task · v0.1.0050
