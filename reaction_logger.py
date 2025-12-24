"""
Reaction Data Logger - Collect and store reaction validation data for analysis
收集并存储反应验证数据，用于后续分析和学习
"""

import json
import os
from datetime import datetime
from threading import Lock

# Data file paths
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
FAILED_REACTIONS_FILE = os.path.join(DATA_DIR, 'failed_reactions.json')
STATS_FILE = os.path.join(DATA_DIR, 'reaction_stats.json')

# Thread lock for file operations
_file_lock = Lock()


def _ensure_data_dir():
    """Ensure data directory exists"""
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        print(f"[Logger] Created data directory: {DATA_DIR}")


def _load_json(filepath, default=None):
    """Load JSON file safely"""
    if default is None:
        default = []
    try:
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"[Logger] Error loading {filepath}: {e}")
    return default


def _save_json(filepath, data):
    """Save JSON file safely"""
    _ensure_data_dir()
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"[Logger] Error saving {filepath}: {e}")
        return False


def log_failed_reaction(reactants, product, smarts, validation_result, reaction_name=None):
    """
    Log a failed reaction for later analysis
    
    Args:
        reactants: List of reactant SMILES
        product: Product SMILES that failed validation
        smarts: SMARTS pattern used
        validation_result: Dict with similarity, is_valid, reason
        reaction_name: Optional reaction type name
    """
    with _file_lock:
        failed_reactions = _load_json(FAILED_REACTIONS_FILE, [])
        
        entry = {
            'timestamp': datetime.now().isoformat(),
            'reactants': reactants if isinstance(reactants, list) else [reactants],
            'product': product,
            'smarts': smarts,
            'reaction_name': reaction_name,
            'similarity': validation_result.get('similarity'),
            'reason': validation_result.get('reason'),
            'validation_type': 'ai_chemberta'
        }
        
        failed_reactions.append(entry)
        
        # Keep only last 1000 entries to prevent file from growing too large
        if len(failed_reactions) > 1000:
            failed_reactions = failed_reactions[-1000:]
        
        _save_json(FAILED_REACTIONS_FILE, failed_reactions)
        print(f"[Logger] Logged failed reaction: {product[:30]}...")


def update_stats(reaction_name, total_products, valid_products, failed_products):
    """
    Update reaction statistics
    
    Args:
        reaction_name: Name of the reaction type
        total_products: Total number of products generated
        valid_products: Number of products that passed validation
        failed_products: Number of products that failed validation
    """
    with _file_lock:
        stats = _load_json(STATS_FILE, {})
        
        if reaction_name not in stats:
            stats[reaction_name] = {
                'total_runs': 0,
                'total_products': 0,
                'valid_products': 0,
                'failed_products': 0,
                'last_run': None
            }
        
        stats[reaction_name]['total_runs'] += 1
        stats[reaction_name]['total_products'] += total_products
        stats[reaction_name]['valid_products'] += valid_products
        stats[reaction_name]['failed_products'] += failed_products
        stats[reaction_name]['last_run'] = datetime.now().isoformat()
        
        # Calculate success rate
        total = stats[reaction_name]['total_products']
        if total > 0:
            stats[reaction_name]['success_rate'] = round(
                stats[reaction_name]['valid_products'] / total * 100, 2
            )
        
        _save_json(STATS_FILE, stats)


def get_failed_reactions(limit=100):
    """Get recent failed reactions"""
    with _file_lock:
        failed = _load_json(FAILED_REACTIONS_FILE, [])
        return failed[-limit:]


def get_stats():
    """Get reaction statistics"""
    with _file_lock:
        return _load_json(STATS_FILE, {})


def get_summary():
    """Get a summary of all logged data"""
    with _file_lock:
        failed = _load_json(FAILED_REACTIONS_FILE, [])
        stats = _load_json(STATS_FILE, {})
        
        # Calculate overall stats
        total_failed = len(failed)
        
        # Group failed by reason
        reason_counts = {}
        for entry in failed:
            reason = entry.get('reason', 'Unknown')
            # Simplify reason
            if 'too much' in reason.lower() or 'differs' in reason.lower():
                key = 'Too Different'
            elif 'too similar' in reason.lower() or 'no effective' in reason.lower():
                key = 'Too Similar'
            else:
                key = 'Other'
            reason_counts[key] = reason_counts.get(key, 0) + 1
        
        return {
            'total_failed_logged': total_failed,
            'failure_reasons': reason_counts,
            'reaction_stats': stats,
            'data_files': {
                'failed_reactions': FAILED_REACTIONS_FILE,
                'stats': STATS_FILE
            }
        }


# Test code
if __name__ == "__main__":
    print("=== Reaction Logger Test ===")
    
    # Test logging a failed reaction
    log_failed_reaction(
        reactants=['CC=C', 'BrBr'],
        product='C',
        smarts='[C:1]=[C:2]>>[C:1][C:2]',
        validation_result={
            'similarity': 0.15,
            'is_valid': False,
            'reason': 'Product differs too much from reactant'
        },
        reaction_name='test_reaction'
    )
    
    # Test updating stats
    update_stats('test_reaction', 5, 3, 2)
    
    # Print summary
    print("\nSummary:")
    print(json.dumps(get_summary(), indent=2, ensure_ascii=False))
