# Proposal: Add Profile Search Filters

Add a profile management system to the chemistry problem generator. This allows users to search and filter simulated user profiles, which can be useful for collaborative features or user management within the tutor application.

## Problem
Currently, there is no way to manage or view user profiles within the application.

## Solution
Implement a profile management panel with:
- Search input for name-based filtering.
- Dropdown filters for Role (e.g., Student, Teacher, Researcher).
- Dropdown filters for Team (e.g., Team A, Team B, Team C).
- A grid/list of profile cards displaying user information.

## Impact
- **UI/UX**: Adds a new section to the main page.
- **State**: Introduces new state variables for profiles and filters.
- **Maintenance**: Requires a new module `modules/profile.js`.
