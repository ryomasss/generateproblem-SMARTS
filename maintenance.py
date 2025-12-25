#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Maintenance Module for Reaction Generator
Project: generateproblem-SMARTS
Author: Antigravity (Google DeepMind)

This script serves as a central hub for maintaining the project's data and AI validation workflow.
Features:
1. Data Pipeline: Convert SMARTS -> JSON -> JS
2. Health Check: Validate reaction rules
3. AI Analytics: View validation stats and failure logs
4. Backup: Snapshot critical data files
"""

import os
import sys
import json
import shutil
import subprocess
import time
from datetime import datetime

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOOLS_DIR = os.path.join(BASE_DIR, 'tools')
DATA_DIR = os.path.join(BASE_DIR, 'data')
BACKUP_DIR = os.path.join(BASE_DIR, 'backups')

# File Paths
SMARTS_FILE = os.path.join(BASE_DIR, 'SMARTS.txt')
PARSED_JSON = os.path.join(BASE_DIR, 'parsed_reactions.json')
REACTIONS_JS = os.path.join(BASE_DIR, 'reactions.js')

# Import local modules
sys.path.append(BASE_DIR)
try:
    import reaction_logger
except ImportError:
    reaction_logger = None
    print("[Warning] Could not import reaction_logger.py")

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def print_header():
    print("=" * 60)
    print("      🧪 Reaction Generator - Maintenance Console      ")
    print("=" * 60)

def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"[Create] Directory created: {directory}")

def run_node_script(script_name):
    """Run a Node.js script from the tools directory"""
    script_path = os.path.join(TOOLS_DIR, script_name)
    if not os.path.exists(script_path):
        print(f"[Error] Script not found: {script_name}")
        return False
    
    print(f"\n[Exec] Running {script_name}...")
    try:
        # Check if node is available
        subprocess.run(['node', '-v'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Run script
        result = subprocess.run(['node', script_path], shell=True) # shell=True for Windows compatibility
        if result.returncode == 0:
            print(f"[Success] {script_name} completed.")
            return True
        else:
            print(f"[Fail] {script_name} failed with code {result.returncode}.")
            return False
    except FileNotFoundError:
        print("[Error] Node.js is not installed or not in PATH.")
        return False
    except Exception as e:
        print(f"[Error] Execution failed: {e}")
        return False

# ==========================================
# Feature 1: Data Pipeline
# ==========================================
def update_data_pipeline():
    print("\n>>> Updating Data Pipeline (SMARTS -> JSON -> JS)")
    
    # Step 1: Convert SMARTS.txt to parsed_reactions.json
    if not run_node_script('convert_smarts.js'):
        return
    
    # Step 2: Validate the generated JSON
    if not run_node_script('validate_reactions.js'):
        print("[Warning] Validation found issues. Please review detailed output above.")
        choice = input("Continue anyway? (y/n): ").lower()
        if choice != 'y':
            return

    # Step 3: Rebuild reactions.js for Frontend
    if run_node_script('rebuild_reactions.js'):
        print("\n[Done] All data files updated successfully.")

# ==========================================
# Feature 2: Health Check
# ==========================================
def run_health_check():
    print("\n>>> Running System Health Check")
    
    # 1. Check file existence
    files = [SMARTS_FILE, PARSED_JSON, REACTIONS_JS]
    print("\n--- File Status ---")
    for f in files:
        status = "✅ Found" if os.path.exists(f) else "❌ Missing"
        size = f"{os.path.getsize(f)/1024:.1f} KB" if os.path.exists(f) else "0 KB"
        print(f"{os.path.basename(f):<25} {status} ({size})")
    
    # 2. Run structural validation
    print("\n--- Logic Validation ---")
    run_node_script('validate_reactions.js')

# ==========================================
# Feature 3: Backup
# ==========================================
def create_backup():
    print("\n>>> Creating Backup")
    ensure_dir(BACKUP_DIR)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_subdir = os.path.join(BACKUP_DIR, f"backup_{timestamp}")
    os.makedirs(backup_subdir)
    
    files_to_backup = [SMARTS_FILE, PARSED_JSON, REACTIONS_JS]
    
    count = 0
    for f in files_to_backup:
        if os.path.exists(f):
            shutil.copy2(f, backup_subdir)
            count += 1
            print(f"[Copy] {os.path.basename(f)}")
            
    print(f"\n[Success] {count} files backed up to: {backup_subdir}")

# ==========================================
# Feature 4: AI Analytics
# ==========================================
def show_ai_stats():
    if not reaction_logger:
        print("\n[Error] Logger module not available.")
        return

    print("\n>>> AI Validation Analytics")
    summary = reaction_logger.get_summary()
    stats = summary.get('reaction_stats', {})
    
    # 1. Overall Summary
    print(f"\nTotal Logged Failures: {summary.get('total_failed_logged', 0)}")
    print("Failure Reasons Breakdown:")
    for reason, count in summary.get('failure_reasons', {}).items():
        print(f"  - {reason}: {count}")
    
    # 2. Success Rates Table
    print("\n--- Reaction Success Rates (Top 20 Active) ---")
    print(f"{'Reaction Name':<40} {'Total':<10} {'Pass%':<10} {'Failures'}")
    print("-" * 75)
    
    sorted_stats = sorted(
        stats.items(), 
        key=lambda x: x[1].get('total_products', 0), 
        reverse=True
    )
    
    for name, data in sorted_stats[:20]:
        total = data.get('total_products', 0)
        rate = data.get('success_rate', 0)
        failed = data.get('failed_products', 0)
        print(f"{name[:38]:<40} {total:<10} {rate:<10}% {failed}")

    # 3. Recent Failures
    print("\n--- Recent 5 Failed Reactions ---")
    failed_log = reaction_logger.get_failed_reactions(5)
    for entry in reversed(failed_log):
        print(f"[{entry['timestamp'][:16]}] {entry['product']}")
        print(f"  Reason: {entry.get('reason')} (Sim: {entry.get('similarity')})")
        print(f"  Reactants: {entry.get('reactants')}")
        print("")

# ==========================================
# Feature 5: Log Cleaning
# ==========================================
def clean_logs():
    print("\n>>> Cleaning Logs")
    stats_file = os.path.join(DATA_DIR, 'reaction_stats.json')
    failed_file = os.path.join(DATA_DIR, 'failed_reactions.json')
    
    if os.path.exists(stats_file):
        size = os.path.getsize(stats_file) / 1024
        print(f"Stats file size: {size:.1f} KB")
    
    choice = input("\nDo you want to archive current logs and start fresh? (y/n): ").lower()
    if choice == 'y':
        create_backup() # Backup first
        
        # Clear files but keep structure
        try:
            with open(stats_file, 'w') as f:
                json.dump({}, f)
            with open(failed_file, 'w') as f:
                json.dump([], f)
            print("[Success] Logs cleared (Previous data backed up).")
        except Exception as e:
            print(f"[Error] Could not clear logs: {e}")

# ==========================================
# Main Menu
# ==========================================
def main_menu():
    while True:
        # clear_screen()
        print_header()
        print("1. [Data] Updates: SMARTS -> JSON -> JS (Run this after editing SMARTS.txt)")
        print("2. [Data] Check: Run Health and Syntax Validation")
        print("3. [Data] Backup: Snapshot critical files")
        print("4. [AI]   Stats: View Validation Success Rates")
        print("5. [AI]   Logs: Clean/Reset Logs")
        print("0. Exit")
        
        choice = input("\nSelect option (0-5): ")
        
        if choice == '1':
            update_data_pipeline()
        elif choice == '2':
            run_health_check()
        elif choice == '3':
            create_backup()
        elif choice == '4':
            show_ai_stats()
        elif choice == '5':
            clean_logs()
        elif choice == '0':
            print("Goodbye!")
            break
        else:
            print("Invalid option.")
        
        input("\nPress Enter to return to menu...")

if __name__ == "__main__":
    try:
        main_menu()
    except KeyboardInterrupt:
        print("\nInterrupted.")
