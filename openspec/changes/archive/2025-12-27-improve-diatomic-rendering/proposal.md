# Proposal: Improve Diatomic and Reagent Rendering

Enhance the chemical structure rendering to display simple diatomic molecules (H2, Br2, Cl2, I2) and common reagents (HBr, HCl, HI, H2O) as chemical formulas with proper subscripts, instead of structural bond diagrams.

## Problem
Currently, some simple reagents are displayed as structural diagrams (e.g., Br-Br), which takes up more space and is less conventional for standard addition reaction problems in a teaching context. Users prefer the standard chemical formula notation (e.g., Br2).

## Solution
1. Expand the `diatomicMolecules` mapping in `renderer.js` to include more variants and common heteronuclear diatomic molecules/reagents.
2. Ensure the rendering logic correctly identifies these molecules and applies subscript formatting to the numerals.
3. Optimize the font sizing to ensure consistency with other molecular labels.

## Impact
- **UI/UX**: Improved legibility and professional aesthetic for reaction equations.
- **Consistency**: All common reagents will follow a unified text-based rendering path.
