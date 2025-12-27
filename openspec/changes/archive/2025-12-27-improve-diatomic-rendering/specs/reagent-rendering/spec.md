# Capability: reagent-rendering

## ADDED Requirements

### Requirement: Render homonuclear diatomics as formulas
The system SHALL render homonuclear diatomic molecules (H2, Br2, Cl2, I2, etc.) as chemical formulas with subscripts.
#### Scenario: Bromine rendering
Given a SMILES string "BrBr"
When the system renders the structure
Then it SHALL display "Br" with a subscript "2"

### Requirement: Render common heteronuclear reagents as formulas
The system SHALL render common reagents like HBr, HCl, HI, and H2O as chemical formulas.
#### Scenario: Water rendering
Given a SMILES string "O" (representing water in current context pools)
When the system renders the structure
Then it SHALL display "H2O" (with subscript 2) or "O" depending on canonical logic, but "H2O" is preferred for clarity in reactions.

### Requirement: Uniform font sizing
The text-based formula rendering SHALL use a font size consistent with RDKit atom labels to maintain visual harmony.
#### Scenario: Size consistency
Given a base size of 300
When a formula is rendered
Then the font size SHALL be approximately baseSize/14.
