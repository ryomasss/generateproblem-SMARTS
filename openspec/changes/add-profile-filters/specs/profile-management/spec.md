# Capability: profile-management

## ADDED Requirements

### Requirement: Search profiles by name
The system SHALL filter the profile list by name when a search term is entered.
#### Scenario: Basic name search
Given a list of profiles
When I type a name in the search box
Then only profiles matching that name should be displayed

### Requirement: Filter profiles by Role
The system SHALL filter the profile list by the selected role.
#### Scenario: Filter by specific Role
Given a list of profiles with roles "Teacher", "Student", and "Researcher"
When I select "Teacher" from the Role dropdown
Then only profiles with the "Teacher" role SHALL be visible

#### Scenario: Selection of 'All Roles'
Given the profile list is currently filtered by "Student"
When I select "All Roles" from the Role dropdown
Then all profiles SHALL be visible (unless filtered by other criteria)

### Requirement: Filter profiles by Team
The system SHALL filter the profile list by the selected team.
#### Scenario: Filter by specific Team
Given a list of profiles assigned to "Team Alpha", "Team Beta", and "Team Gamma"
When I select "Team Beta" from the Team dropdown
Then only profiles assigned to "Team Beta" SHALL be visible

#### Scenario: Selection of 'All Teams'
Given the profile list is currently filtered by "Team Alpha"
When I select "All Teams" from the Team dropdown
Then all profiles SHALL be visible (unless filtered by other criteria)

### Requirement: Multi-attribute filtering
The system SHALL apply all selected filters and search terms cumulatively.
#### Scenario: Combined search and filter
Given a search term and selected filters
When I apply them together
Then only profiles matching ALL criteria should be shown
