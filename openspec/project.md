# Project Context

## Purpose
有机化学反应出题器 (Organic Chemistry Reaction Problem Generator) - An educational application that generates organic chemistry reaction problems for students. The system dynamically generates chemical reaction products using SMARTS reaction rules and validates them using ChemBERTa AI to ensure chemical reasonableness.

**Key Goals:**
- Dynamically generate organic chemistry reaction problems from a database of 100+ SMARTS reaction rules
- Render high-quality chemical structure diagrams using RDKit
- Filter out chemically unreasonable products using AI (ChemBERTa)
- Provide a customizable, user-friendly web interface for students and educators

## Tech Stack

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)** - Vanilla web technologies
- **RDKit.js (WASM)** - Browser-side chemical structure rendering (`@rdkit/rdkit ^2025.3.4`)

### Backend
- **Python 3.8+** - Server runtime
- **Flask** - Web server framework
- **RDKit (Python)** - Chemical reaction engine for SMARTS rule execution

### AI/ML
- **ChemBERTa** (`seyonec/ChemBERTa-zinc-base-v1`) - Chemical reaction validation
- **Transformers** - HuggingFace library for model inference
- **PyTorch** - ML framework

### Data
- **SMARTS.txt** - Master reaction rules database (~57KB, 100+ reactions)
- **reactions.js** - Parsed reaction rules for frontend use

## Project Conventions

### Code Style
- **JavaScript**: ES6+ modules, `camelCase` for functions/variables
- **Python**: PEP 8 style, `snake_case` for functions/variables
- **CSS**: BEM-like class naming, CSS custom properties for theming
- **Comments**: Chinese comments are acceptable (bilingual codebase)

### File Organization
```
/                     # Root - main entry files
├── index.html        # Main UI page
├── style.css         # Global styles
├── server.py         # Flask backend entry point
├── ai_validator.py   # ChemBERTa validation module
├── reactions.js      # Parsed SMARTS rules (generated)
├── SMARTS.txt        # Master reaction database (source of truth)
└── modules/          # Frontend JavaScript modules
    ├── reaction-engine.js   # Core reaction logic
    ├── ui-controller.js     # UI event handling
    ├── renderer.js          # Chemical structure rendering
    ├── pubchem-api.js       # PubChem molecule search
    ├── state.js             # Application state management
    └── utils.js             # Utility functions
```

### Architecture Patterns
- **Frontend**: Modular ES6 imports, state management via `state.js`
- **Backend**: Flask routes handle API requests, lazy-loaded AI models
- **Reaction Pipeline**: 
  1. Frontend selects reaction type and fetches molecules from PubChem
  2. Backend applies SMARTS rules via RDKit to generate products
  3. AI validator filters unreasonable products
  4. Frontend renders results using RDKit.js

### Testing Strategy
- **Python Tests**: Located in `tests/` directory
- **Manual Testing**: Run `python server.py` and test in browser at `http://localhost:8000`
- **Maintenance Tool**: `python maintenance.py` for system health checks

### Git Workflow
- Single branch development (main)
- Commits should reference specific changes (no strict conventional commits required)

## Domain Context

### Chemistry Concepts
- **SMILES**: Simplified Molecular Input Line Entry System - text representation of molecules
- **SMARTS**: SMILES Arbitrary Target Specification - patterns for substructure matching
- **Reaction Types**: Alkene additions, substitutions, oxidations, reductions, condensations, etc.
- **Product Validation**: AI compares molecular embeddings to ensure reactant→product transformation is chemically reasonable

### User Flow
1. User selects reaction category (alkene, alcohol, aromatic, etc.)
2. System fetches suitable reactant molecules from PubChem
3. RDKit applies SMARTS rules to compute products
4. ChemBERTa validates the reaction reasonableness
5. Valid products are displayed; invalid ones show "?" placeholder

## Important Constraints
- **Server Required**: Application cannot run as static HTML - requires Flask backend for RDKit and AI
- **AI Model Loading**: First request is slow (~5-10s) due to model initialization
- **Browser Compatibility**: Requires modern browser with WebAssembly support (Chrome, Edge recommended)
- **Bilingual**: UI and documentation mix English and Chinese

## External Dependencies
- **PubChem API** (`pubchem.ncbi.nlm.nih.gov`) - Molecule structure search
- **HuggingFace Models** - ChemBERTa model download on first use
- **RDKit WASM** - Loaded from npm package @rdkit/rdkit
