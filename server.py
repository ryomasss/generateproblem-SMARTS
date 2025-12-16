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

# Global error handler for all unhandled exceptions
@app.errorhandler(Exception)
def handle_exception(e):
    import traceback
    error_msg = f"Unhandled exception: {e}\n{traceback.format_exc()}"
    print(error_msg)
    return jsonify({'error': str(e), 'products': []}), 500

@app.errorhandler(500)
def handle_500(e):
    return jsonify({'error': 'Internal server error', 'products': []}), 500

# Reaction API Endpoint
@app.route('/api/react', methods=['POST', 'OPTIONS'])
def run_reaction():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})
    
    try:
        # 安全解析 JSON
        try:
            data = request.json
        except Exception as json_error:
            print(f"JSON 解析错误: {json_error}")
            return jsonify({'error': f'Invalid JSON: {json_error}', 'products': []})
        
        if data is None:
            print("请求体为空或不是 JSON 格式")
            return jsonify({'error': 'Request body is empty or not JSON', 'products': []})
        
        smarts = data.get('smarts')
        reactants_smiles = data.get('reactants', [])

        print(f"\n{'='*60}")
        print(f"Received request - SMARTS: {smarts}")
        print(f"Reactants: {reactants_smiles}")
        print(f"Reactants type: {type(reactants_smiles)}")

        if not smarts:
            return jsonify({'error': 'Missing smarts', 'products': []})
        
        if not reactants_smiles:
            return jsonify({'error': 'Missing reactants', 'products': []})
        
        # 确保 reactants_smiles 是列表
        if isinstance(reactants_smiles, str):
            reactants_smiles = [reactants_smiles]

        # Create reaction from SMARTS
        try:
            rxn = AllChem.ReactionFromSmarts(smarts)
        except Exception as smarts_error:
            print(f"SMARTS 解析错误: {smarts_error}")
            return jsonify({'error': f'SMARTS parse error: {smarts_error}', 'products': []})
        
        if rxn is None:
            print(f"Invalid SMARTS: {smarts}")
            return jsonify({'error': 'Invalid SMARTS - ReactionFromSmarts returned None', 'products': []})

        # Log reaction details
        num_reactant_templates = rxn.GetNumReactantTemplates()
        num_product_templates = rxn.GetNumProductTemplates()
        print(f"Reaction: {num_reactant_templates} reactants -> {num_product_templates} products")

        # Create reactant molecules
        reactants = []
        for smi in reactants_smiles:
            if not smi or not isinstance(smi, str):
                print(f"  Reactant: {smi} (SKIPPED - invalid type)")
                continue
            try:
                mol = Chem.MolFromSmiles(smi)
                if mol:
                    reactants.append(mol)
                    print(f"  Reactant: {smi} (valid)")
                else:
                    print(f"  Reactant: {smi} (INVALID - MolFromSmiles returned None)")
            except Exception as mol_error:
                print(f"  Reactant: {smi} (ERROR: {mol_error})")

        if len(reactants) == 0:
            print("No valid reactants")
            return jsonify({'error': 'No valid reactant molecules', 'products': []})

        # Check if number of reactants matches the reaction template
        if len(reactants) < num_reactant_templates:
            print(f"Warning: Need {num_reactant_templates} reactants, got {len(reactants)}")
            # 尝试复制反应物以满足模板需求
            while len(reactants) < num_reactant_templates and len(reactants) > 0:
                reactants.append(reactants[0])
                print(f"Duplicated first reactant to meet template requirement")
        
        # Run reaction
        try:
            products_tuple = rxn.RunReactants(tuple(reactants))
            print(f"Reaction produced {len(products_tuple)} product sets")
        except Exception as run_error:
            import traceback
            print(f"Reaction run failed: {run_error}")
            print(traceback.format_exc())
            return jsonify({'products': [], 'error': f'Reaction execution failed: {run_error}'})

        unique_products = set()
        
        for product_set in products_tuple:
            for mol in product_set:
                try:
                    Chem.SanitizeMol(mol)
                    # 生成规范 SMILES
                    smi = Chem.MolToSmiles(mol, canonical=True)
                    
                    # 验证：重新解析 SMILES 确保有效
                    verify_mol = Chem.MolFromSmiles(smi)
                    if verify_mol is None:
                        print(f"  ⚠️ 产物 SMILES 无法重新解析: {smi}")
                        continue
                    
                    # 过滤过于复杂的分子（长度 > 80 或原子数 > 30）
                    if len(smi) > 80:
                        print(f"  ⚠️ 产物过于复杂 (长度 {len(smi)}): {smi[:40]}...")
                        continue
                    
                    atom_count = verify_mol.GetNumAtoms()
                    if atom_count > 30:
                        print(f"  ⚠️ 产物原子数过多 ({atom_count}): {smi[:40]}...")
                        continue
                    
                    unique_products.add(smi)
                    print(f"  ✅ Product: {smi}")
                except Exception as sanitize_error:
                    print(f"  Sanitization error: {sanitize_error}")
                    continue

        result = list(unique_products)
        
        if len(result) == 0:
            print(f"No valid products generated - reactants may not match SMARTS pattern")
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
