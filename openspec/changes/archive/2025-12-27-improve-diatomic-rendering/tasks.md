# Tasks: Improve Diatomic Rendering

## Implementation
- [x] Update `renderer.js` to expand the list of molecules rendered as text formulas.
- [x] Implement a more robust SMILES normalization for the formula check.
- [x] Refine the CSS/HTML generation for formulas with multiple subscripts (e.g., $H_2O$).

## Verification
- [x] Verify $Br_2$ rendering in Bromine addition.
- [x] Verify $H_2O$ rendering in hydration reactions.
- [x] Verify $HBr$ rendering in HX addition.
- [x] Compare rendering size with RDKit atom labels for consistency.
