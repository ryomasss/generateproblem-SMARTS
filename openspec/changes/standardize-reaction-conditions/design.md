# Design: Standardized Reaction Conditions

This change focuses on the semantics of the `condition` field in the reaction database and how it reflects in the UI.

## Proposed Changes

### [reactions.js](file:///c:/Users/ryoma/Desktop/出题器/generateproblem-SMARTS/reactions.js)
- **Data Audit**: Audit all entries in `window.REACTION_DB_EXTENDED`.
- **Transformation**:
    - If `condition` is identical or similar to `name`, replace it with specific chemical notation.
    - Examples:
        - `alkene_gen_1`: "烯烃与溴加成" → "Br₂ / CCl₄"
        - `alkene_gen_10`: "与水加成" → "H+, H₂O"
        - `alkene_gen_15`: "环氧化反应" → "mCPBA"
- **Subscript Support**: Ensure common notation like $H_2O$ uses the recently implemented subscript rendering or is simple enough for standard text.

### [ui-controller.js](file:///c:/Users/ryoma/Desktop/出题器/generateproblem-SMARTS/modules/ui-controller.js)
- **Problem Layout**:
    - Optional: Rename `.problem-type` to something less prominent or hide it until "Show Answer".
    - Currently, `clone.querySelector(".problem-type").textContent = `${def.name}`;` displays the answer at the top. This should be made optional or moved.

## Architecture
No change to the core reaction engine. This is purely a data normalization and UI presentation effort.
