import os
import sys
from flask import Flask, request, jsonify, send_from_directory
from rdkit import Chem
from rdkit.Chem import AllChem

app = Flask(__name__, static_folder='.')

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Serve static files (HTML, JS, CSS)
@app.route('/')
def index():
    return send_from_directory('.', 'random.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Reaction API Endpoint
@app.route('/api/react', methods=['POST'])
def run_reaction():
    try:
        data = request.json
        smarts = data.get('smarts')
        reactants_smiles = data.get('reactants', [])

        print(f"\n{'='*60}")
        print(f"Received request - SMARTS: {smarts}")
        print(f"Reactants: {reactants_smiles}")

        if not smarts or not reactants_smiles:
            return jsonify({'error': 'Missing smarts or reactants', 'products': []}), 400

        # Create reaction from SMARTS
        rxn = AllChem.ReactionFromSmarts(smarts)
        if rxn is None:
            print(f"Invalid SMARTS: {smarts}")
            return jsonify({'error': 'Invalid SMARTS', 'products': []}), 400

        # Log reaction details
        print(f"Reaction: {rxn.GetNumReactantTemplates()} reactants -> {rxn.GetNumProductTemplates()} products")

        # Create reactant molecules
        reactants = []
        for smi in reactants_smiles:
            mol = Chem.MolFromSmiles(smi)
            if mol:
                reactants.append(mol)
                print(f"  Reactant: {smi} (valid)")
            else:
                print(f"  Reactant: {smi} (INVALID)")
                return jsonify({'error': f'Invalid reactant SMILES: {smi}', 'products': []}), 400

        # Check if number of reactants matches the reaction template
        num_required = rxn.GetNumReactantTemplates()
        if len(reactants) < num_required:
            print(f"Warning: Need {num_required} reactants, got {len(reactants)}")
            # Try with what we have, but may produce no products
        
        # Run reaction
        # RunReactants returns a tuple of tuples of products (Mol objects)
        try:
            products_tuple = rxn.RunReactants(tuple(reactants))
            print(f"Reaction produced {len(products_tuple)} product sets")
        except Exception as run_error:
            # If reaction fails (e.g., reactants don't match template), return empty
            print(f"Reaction run failed: {run_error}")
            return jsonify({'products': [], 'error': f'Reaction failed: {run_error}'})

        unique_products = set()
        
        for product_set in products_tuple:
            for mol in product_set:
                # Sanitize molecule to ensure valid SMILES
                try:
                    Chem.SanitizeMol(mol)
                    smi = Chem.MolToSmiles(mol)
                    unique_products.add(smi)
                    print(f"  Product: {smi}")
                except Exception as sanitize_error:
                    print(f"  Sanitization error: {sanitize_error}")
                    continue

        result = list(unique_products)
        
        if len(result) == 0:
            print(f"No products generated - reactants may not match SMARTS pattern")
        else:
            print(f"Returning {len(result)} unique products")
        
        print(f"{'='*60}\n")
        return jsonify({'products': result})

    except Exception as e:
        import traceback
        error_msg = f"Error executing reaction: {e}\n{traceback.format_exc()}"
        print(error_msg)
        # Return empty products instead of 500 error for graceful degradation
        return jsonify({'products': [], 'error': str(e)})

if __name__ == '__main__':
    print("Starting Flask Reaction Server on port 8000...")
    print("RDKit Version:", Chem.rdBase.rdkitVersion)
    app.run(port=8000, debug=True)
