# Design: Profile Management System

The profile management system will be a client-side feature that overlays or integrates into the existing dashboard.

## Components
- **Data Model**: Mock profile data stored in `modules/profile.js`.
- **Filtering Logic**: A pure function `filterProfiles` that takes the full list and filter criteria.
- **UI Component**: A new section in `index.html` with appropriate styling in `style.css`.
- **Controller**: Functions in `modules/ui-controller.js` to handle event listeners and DOM updates for the profile list.

## Architecture
- **State Integration**: Add `profiles`, `filteredProfiles`, and `profileFilters` to `appState` in `modules/state.js`.
- **Modularity**: Keep the profile data and core logic separate from the chemistry reaction engine.
- **Rendering**: Use a standard card-based layout for profiles.
