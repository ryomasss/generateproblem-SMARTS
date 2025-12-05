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

        print(f"Received request - SMARTS: {smarts}, Reactants: {reactants_smiles}")

        if not smarts or not reactants_smiles:
            return jsonify({'error': 'Missing smarts or reactants'}), 400

        # Create reaction from SMARTS
        rxn = AllChem.ReactionFromSmarts(smarts)
        if rxn is None:
            print(f"Invalid SMARTS: {smarts}")
            return jsonify({'error': 'Invalid SMARTS'}), 400

        # Create reactant molecules
        reactants = []
        for smi in reactants_smiles:
            mol = Chem.MolFromSmiles(smi)
            if mol:
                reactants.append(mol)
            else:
                print(f"Invalid reactant SMILES: {smi}")
                return jsonify({'error': f'Invalid reactant SMILES: {smi}'}), 400

        # Run reaction
        # RunReactants returns a tuple of tuples of products (Mol objects)
        products_tuple = rxn.RunReactants(tuple(reactants))
        
        print(f"Reaction produced {len(products_tuple)} product sets")

        unique_products = set()
        
        for product_set in products_tuple:
            for mol in product_set:
                # Sanitize molecule to ensure valid SMILES
                try:
                    Chem.SanitizeMol(mol)
                    smi = Chem.MolToSmiles(mol)
                    unique_products.add(smi)
                    print(f"Product SMILES: {smi}")
                except Exception as sanitize_error:
                    print(f"Sanitization error: {sanitize_error}")
                    continue

        result = list(unique_products)
        print(f"Returning {len(result)} unique products: {result}")
        return jsonify({'products': result})

    except Exception as e:
        import traceback
        error_msg = f"Error executing reaction: {e}\n{traceback.format_exc()}"
        print(error_msg)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask Reaction Server on port 8000...")
    print("RDKit Version:", Chem.rdBase.rdkitVersion)
    app.run(port=8000, debug=True)
