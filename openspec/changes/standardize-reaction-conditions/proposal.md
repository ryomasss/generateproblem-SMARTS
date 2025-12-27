# Proposal: Standardize Reaction Conditions Notation

Systematically replace descriptive Chinese text in reaction conditions (e.g., "烯烃与溴加成") with actual chemical notation (e.g., "Br₂ / CCl₄", "H+, H₂O") to improve educational realism and reduce answer spoiler frequency.

## Problem
Currently, the `condition` field in many reactions in `reactions.js` contains a Chinese description of the reaction itself.
- This is redundant because the reactants are already shown.
- It "spoils" the answer by telling the student exactly what reaction they are looking at.
- It is visually cluttered and less professional than standard chemical arrow notation.

## Solution
1.  **Refactor `REACTION_DB_EXTENDED`**: Update the `condition` field for all key reaction categories to use reagents, solvents, and catalysts instead of Chinese descriptions.
2.  **Decouple Labels**: Ensure the `name` of the reaction (used for indexing/selection) is distinct from the `condition` shown on the arrow.
3.  **UI Hiding**: Potentially add a "Challenge Mode" or hide the problem title by default until the answer is requested.

## Impact
- **Educational**: Higher difficulty and realism; students must identify reactions from structures and conditions alone.
- **Productivity**: Better alignment with standard organic chemistry textbook formats.
