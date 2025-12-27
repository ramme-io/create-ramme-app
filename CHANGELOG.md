# Changelog

All notable changes to this project will be documented in this file.

## [1.2.1] - 2025-12-27
### Fixed
- Minor dependency stabilization for the `useDataQuery` hook.
- Prepared internal architecture for Phase 2 (Logic Layer) integration.

## [1.2.0] - 2025-12-27
### Added
- **Runtime Logic Engine**: Introduced `useDataQuery` hook for client-side filtering, sorting, and pagination of mock data.
- **Data Persistence**: Added `useCrudLocalStorage` and `data-seeder.ts` to persist state across reloads.
- **SmartTable Component**: A data-aware wrapper for `DataTable` that auto-generates columns from metadata and handles CRUD actions.
- **AutoForm Component**: A schema-driven form builder that generates inputs based on resource definitions.
- **Ghost Mode Bridge**: Added `postMessage` support to `GhostOverlay` for bi-directional communication with the App Builder.

### Changed
- **Navigation**: Migrated to a centralized `sitemap-driven` architecture for better AI control.
- **Layouts**: Split layouts into `DashboardLayout` (Sidebar) and `DocsLayout` (Top Nav).