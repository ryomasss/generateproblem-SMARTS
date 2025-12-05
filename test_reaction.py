"""测试反应执行"""
from rdkit import Chem
from rdkit.Chem import AllChem

# 测试 aldol_condensation反应
smarts = "[C:1][C:2](=O).[C:3][C:4](=O)>>[C:1][C:2](=O)[C:3][C:4](=O)"
reactants_smiles = ["CC=O", "CC=O"]  # 两个乙醛分子

print(f"Testing SMARTS: {smarts}")
print(f"Reactants: {reactants_smiles}")

# Create reaction from SMARTS
rxn = AllChem.ReactionFromSmarts(smarts)
if rxn is None:
    print("ERROR: Invalid SMARTS!")
    exit(1)

# Create reactant molecules
reactants = []
for smi in reactants_smiles:
    mol = Chem.MolFromSmiles(smi)
    if mol:
        reactants.append(mol)
        print(f"Created mol from {smi}: {Chem.MolToSmiles(mol)}")
    else:
        print(f"ERROR: Invalid SMILES: {smi}")
        exit(1)

# Run reaction
print(f"\nRunning reaction with {len(reactants)} reactants...")
products_tuple = rxn.RunReactants(tuple(reactants))

print(f"Reaction produced {len(products_tuple)} product sets")

for i, product_set in enumerate(products_tuple):
    print(f"\nProduct set {i}:")
    for j, mol in enumerate(product_set):
        try:
            Chem.SanitizeMol(mol)
            smi = Chem.MolToSmiles(mol)
            print(f"  Product {j}: {smi}")
        except Exception as e:
            print(f"  Product {j}: ERROR - {e}")
