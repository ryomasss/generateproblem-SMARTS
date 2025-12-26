#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
AI Dataset Annotation Tool
用于人工标注 AI 拦截的反应，生成微调数据集。
"""

import json
import os
import sys

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAILED_FILE = os.path.join(BASE_DIR, 'data', 'failed_reactions.json')
TRAIN_FILE = os.path.join(BASE_DIR, 'data', 'training_data.jsonl')

def load_failed():
    if not os.path.exists(FAILED_FILE):
        return []
    try:
        with open(FAILED_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def save_training_data(entry):
    """Save an entry to JSONL format"""
    with open(TRAIN_FILE, 'a', encoding='utf-8') as f:
        f.write(json.dumps(entry, ensure_ascii=False) + '\n')

def main():
    print("=" * 60)
    print("      🧪 AI 反应数据标注工具 (Data Annotator)      ")
    print("=" * 60)
    
    entries = load_failed()
    
    if not entries:
        print("\n[Info] 没有发现被拦截的反应记录。")
        return

    print(f"\n发现 {len(entries)} 条待处理记录。")
    print("操作逻辑：")
    print(" [y] - 合理 (AI 判错了，这是个正确的化学反应)")
    print(" [n] - 不合理 (AI 判对了，这个产物写错了)")
    print(" [s] - 跳过 (不确定)")
    print(" [q] - 退出并保存\n")

    remaining = []
    processed_count = 0

    for i, entry in enumerate(entries):
        print("-" * 50)
        print(f"条目 {i+1}/{len(entries)}")
        print(f"反应物: {'.'.join(entry['reactants'])}")
        print(f"产物:   {entry['product']}")
        print(f"AI 评分: {entry['similarity']} (原因: {entry['reason']})")
        
        while True:
            choice = input("\n该反应是否合理? [y/n/s/q]: ").lower()
            
            if choice == 'y':
                # 记录为正确 (1)
                save_training_data({
                    "reactants": ".".join(entry['reactants']),
                    "product": entry['product'],
                    "label": 1,
                    "smarts": entry.get('smarts')
                })
                processed_count += 1
                break
            elif choice == 'n':
                # 记录为错误 (0)
                save_training_data({
                    "reactants": ".".join(entry['reactants']),
                    "product": entry['product'],
                    "label": 0,
                    "smarts": entry.get('smarts')
                })
                processed_count += 1
                break
            elif choice == 's':
                remaining.append(entry)
                break
            elif choice == 'q':
                # 退出前保存未处理的
                remaining.extend(entries[i:])
                break
            else:
                print("无效输入，请输入 y, n, s 或 q")
        
        if choice == 'q':
            break

    # 更新失败记录文件，移除已处理的
    with open(FAILED_FILE, 'w', encoding='utf-8') as f:
        json.dump(remaining, f, indent=2, ensure_ascii=False)

    print(f"\n标注完成！")
    print(f"本次标注: {processed_count} 条")
    print(f"剩余待处理: {len(remaining)} 条")
    print(f"数据集位置: {TRAIN_FILE}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n操作已取消。")
