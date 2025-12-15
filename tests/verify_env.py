import sys
try:
    import rdkit
    print(f"RDKit_OK: {rdkit.__version__}")
except ImportError:
    print("RDKit_MISSING")

try:
    import flask
    print(f"Flask_OK: {flask.__version__}")
except ImportError:
    print("Flask_MISSING")
