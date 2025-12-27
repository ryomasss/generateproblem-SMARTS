# Capability: reaction-notation

## MODIFIED Requirements

### Requirement: Use chemical notation for conditions
The system SHALL use actual chemical symbols, reagents, and solvent names for the `condition` field in reaction definitions, avoiding descriptive Chinese names that spoil the reaction type.
#### Scenario: Bromine addition notation
Given a reaction "alkene_gen_1"
When the system displays the condition on the arrow
Then it SHALL show concentrated notation like "Br₂ / CCl₄" or similar appropriate reagents.

### Requirement: Hide reaction names initially
The system SHALL hide the specific name of the reaction (e.g., "烯烃与溴加成") from the problem title by default to prevent spoilers.
#### Scenario: Problem initial state
Given a newly generated problem
When the user views the problem
Then the `.problem-type` SHALL be hidden or show a generic placeholder until the user toggles the answer.

### Requirement: Reveal names on answer toggle
The system SHALL reveal the reaction name when the user chooses to "Show Answer".
#### Scenario: Revealing answer
Given a problem with a hidden name
When the user clicks "Show Answer"
Then the `.problem-type` SHALL become visible using CSS transitions.
