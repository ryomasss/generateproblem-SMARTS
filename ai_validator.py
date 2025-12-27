"""
AI Validation Module - Use ChemBERTa to verify chemical reaction validity
"""

from transformers import AutoModel, AutoTokenizer
import torch

# Model config - using publicly available ChemBERTa model
MODEL_NAME = "seyonec/ChemBERTa-zinc-base-v1"

# Global variables (lazy loading)
_tokenizer = None
_model = None

def _load_model():
    """Lazy load model (on first call)"""
    global _tokenizer, _model
    if _model is None:
        print("[INFO] Loading ChemBERTa model...")
        _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        _model = AutoModel.from_pretrained(MODEL_NAME)
        _model.eval()  # Set to inference mode
        print("[OK] ChemBERTa model loaded successfully")
    return _tokenizer, _model


def get_molecule_embedding(smiles):
    """
    Convert SMILES to chemical feature vector
    
    Args:
        smiles: SMILES string of molecule
        
    Returns:
        torch.Tensor: Feature vector (1, hidden_size)
    """
    tokenizer, model = _load_model()
    
    inputs = tokenizer(
        smiles, 
        return_tensors="pt", 
        padding=True, 
        truncation=True, 
        max_length=512
    )
    
    with torch.no_grad():
        outputs = model(**inputs)
    
    # Use mean of last hidden state as molecule vector
    embedding = outputs.last_hidden_state.mean(dim=1)
    return embedding


def check_reaction_validity(reactant_smiles, product_smiles):
    """
    Check if reaction is reasonable (by comparing reactant and product feature vectors)
    
    Args:
        reactant_smiles: Reactant SMILES string (or list)
        product_smiles: Product SMILES string
        
    Returns:
        dict: Contains similarity, validity flag, and reason
    """
    # Handle multiple reactants
    if isinstance(reactant_smiles, list):
        reactant_smiles = ".".join(reactant_smiles)
    
    try:
        r_emb = get_molecule_embedding(reactant_smiles)
        p_emb = get_molecule_embedding(product_smiles)
        
        # Calculate cosine similarity
        similarity = torch.nn.functional.cosine_similarity(r_emb, p_emb).item()
        
        # Logic:
        # - Too low (< 0.3): Product differs too much from reactant
        # - Too high (> 0.95): Possibly no effective reaction occurred
        # - Reasonable range: 0.3 ~ 0.95
        is_valid = 0.3 < similarity < 0.95
        
        if similarity <= 0.3:
            reason = "Product differs too much from reactant - possibly abnormal reaction"
        elif similarity >= 0.95:
            reason = "Product too similar to reactant - possibly no effective reaction"
        else:
            reason = "Product-reactant similarity is within reasonable range"
        
        return {
            "similarity": round(similarity, 4),
            "is_valid": is_valid,
            "reason": reason
        }
        
    except Exception as e:
        return {
            "similarity": 0.0,
            "is_valid": False,
            "reason": f"Validation failed: {str(e)}"
        }


def batch_validate(reactions):
    """
    Batch validate multiple reactions
    
    Args:
        reactions: List of (reactant_smiles, product_smiles) tuples
        
    Returns:
        list: Validation results
    """
    results = []
    for reactant, product in reactions:
        result = check_reaction_validity(reactant, product)
        results.append({
            "reactant": reactant,
            "product": product,
            **result
        })
    return results


# Test code
if __name__ == "__main__":
    print("=" * 60)
    print("ChemBERTa Reaction Validation Module Test")
    print("=" * 60)
    
    # Test cases
    test_cases = [
        # (reactant, product, description)
        ("CC=C", "CC(Br)CBr", "Propene + Br2 -> 1,2-dibromopropane (valid)"),
        ("c1ccccc1", "c1ccc(Br)cc1", "Benzene + Br2 -> Bromobenzene (valid)"),
        ("CC=O", "CCO", "Acetaldehyde + H2 -> Ethanol (valid)"),
        ("C", "c1ccccc1", "Methane -> Benzene (invalid - too different)"),
    ]
    
    print("\n[TEST] Starting tests...\n")
    
    for reactant, product, description in test_cases:
        print(f"Test: {description}")
        print(f"  Reactant: {reactant}")
        print(f"  Product:  {product}")
        
        result = check_reaction_validity(reactant, product)
        
        print(f"  Similarity: {result['similarity']}")
        print(f"  Valid: {'[YES]' if result['is_valid'] else '[NO]'}")
        print(f"  Reason: {result['reason']}")
        print()
    
    print("=" * 60)
    print("Test completed")

