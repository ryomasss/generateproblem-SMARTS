# Design: Diatomic and Reagent Rendering Enhancement

The enhancement will leverage the existing text-based rendering path in `renderer.js` and extend its coverage.

## Proposed Changes

### [renderer.js](file:///c:/Users/ryoma/Desktop/出题器/generateproblem-SMARTS/modules/renderer.js)
- **Mapping Expansion**: Update the `diatomicMolecules` object (to be renamed/expanded to `reagentFormulas`) to include:
    - Homonuclear: `H2`, `Br2`, `Cl2`, `I2`, `F2`, `O2`, `N2`.
    - Heteronuclear/Reagents: `HBr`, `HCl`, `HI`, `HF`, `H2O`, `HOBr`, `HOCl`, `HOI`.
- **Normalization**: Canonicalize the input SMILES before checking the mapping to handle variations (e.g., `BrBr` vs `[Br][Br]`).

### Logic Refinement
- The rendering function `createStructureSVG` will continue to return a text-based `div` for these mapped molecules.
- Subscript logic using `<sub>` tags will be applied to all numbers in the formula.

## Architecture
This remains a purely frontend change in the rendering layer. It doesn't affect the reaction engine or the molecular pools.
