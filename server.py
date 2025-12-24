import os
import sys
from flask import Flask, request, jsonify, send_from_directory
from rdkit import Chem
from rdkit.Chem import AllChem

# AI Validation configuration
AI_VALIDATION_ENABLED = True  # Set to False to disable AI validation

# Data logging configuration
DATA_LOGGING_ENABLED = True  # Set to False to disable data logging

# Lazy import of ai_validator (only when needed)
ai_validator = None
reaction_logger = None

def get_ai_validator():
    """Lazy load ai_validator module to avoid slow startup"""
    global ai_validator
    if ai_validator is None and AI_VALIDATION_ENABLED:
        try:
            import ai_validator as av
            ai_validator = av
            print("[INFO] AI Validator module loaded successfully")
        except ImportError as e:
            print(f"[WARNING] Could not load AI Validator: {e}")
            return None
    return ai_validator

def get_reaction_logger():
    """Lazy load reaction_logger module"""
    global reaction_logger
    if reaction_logger is None and DATA_LOGGING_ENABLED:
        try:
            import reaction_logger as rl
            reaction_logger = rl
            print("[INFO] Reaction Logger module loaded successfully")
        except ImportError as e:
            print(f"[WARNING] Could not load Reaction Logger: {e}")
            return None
    return reaction_logger

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

# Statistics API Endpoint
@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get reaction validation statistics and failed reactions log"""
    logger = get_reaction_logger()
    if logger:
        summary = logger.get_summary()
        return jsonify({
            'success': True,
            'data': summary
        })
    else:
        return jsonify({
            'success': False,
            'error': 'Reaction logger not available'
        })

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
                        print(f"  [!] Product SMILES cannot be reparsed: {smi}")
                        continue
                    
                    # 过滤过于复杂的分子（长度 > 80 或原子数 > 30）
                    if len(smi) > 80:
                        print(f"  [!] Product too complex (length {len(smi)}): {smi[:40]}...")
                        continue
                    
                    atom_count = verify_mol.GetNumAtoms()
                    if atom_count > 30:
                        print(f"  [!] Product atom count too high ({atom_count}): {smi[:40]}...")
                        continue
                    
                    unique_products.add(smi)
                    print(f"  [OK] Product: {smi}")
                except Exception as sanitize_error:
                    print(f"  Sanitization error: {sanitize_error}")
                    continue

        result = list(unique_products)
        
        # AI Validation step
        validated_products = []
        validation_results = []
        
        validator = get_ai_validator()
        if validator and len(result) > 0:
            print(f"\n[AI] Starting AI validation for {len(result)} products...")
            
            for product_smiles in result:
                try:
                    # Use all reactants for validation
                    validation = validator.check_reaction_validity(
                        reactants_smiles, 
                        product_smiles
                    )
                    
                    validation_info = {
                        'product': product_smiles,
                        'similarity': validation['similarity'],
                        'is_valid': validation['is_valid'],
                        'reason': validation['reason']
                    }
                    validation_results.append(validation_info)
                    
                    if validation['is_valid']:
                        validated_products.append(product_smiles)
                        print(f"  [OK] {product_smiles}: similarity={validation['similarity']:.4f} (VALID)")
                    else:
                        print(f"  [X] {product_smiles}: similarity={validation['similarity']:.4f} - {validation['reason']}")
                        # Log failed reaction for learning
                        logger = get_reaction_logger()
                        if logger:
                            logger.log_failed_reaction(
                                reactants=reactants_smiles,
                                product=product_smiles,
                                smarts=smarts,
                                validation_result=validation,
                                reaction_name=data.get('reaction_name')
                            )
                        
                except Exception as val_error:
                    print(f"  [!] Validation error for {product_smiles}: {val_error}")
                    # If validation fails, keep the product by default
                    validated_products.append(product_smiles)
                    validation_results.append({
                        'product': product_smiles,
                        'similarity': None,
                        'is_valid': True,
                        'reason': f'Validation skipped: {val_error}'
                    })
            
            print(f"[AI] Validation complete: {len(validated_products)}/{len(result)} products passed")
            
            # Update statistics
            logger = get_reaction_logger()
            if logger:
                failed_count = len(result) - len(validated_products)
                logger.update_stats(
                    reaction_name=data.get('reaction_name', 'unknown'),
                    total_products=len(result),
                    valid_products=len(validated_products),
                    failed_products=failed_count
                )
            
            result = validated_products
        
        if len(result) == 0:
            print(f"No valid products generated - reactants may not match SMARTS pattern")
        else:
            print(f"Returning {len(result)} unique products")
        
        print(f"{'='*60}\n")
        
        # Include validation info in response if AI validation was performed
        response_data = {'products': result}
        if validation_results:
            response_data['validation'] = validation_results
            response_data['ai_validated'] = True
        
        return jsonify(response_data)

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
