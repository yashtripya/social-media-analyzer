import sqlite3
import json
from datetime import datetime
from app.config import settings

def get_db():
    conn = sqlite3.connect(settings.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            platform TEXT NOT NULL,
            original_post TEXT NOT NULL,
            score INTEGER NOT NULL,
            analysis TEXT NOT NULL,
            recommendations TEXT NOT NULL,
            improved_post TEXT NOT NULL
        );
    """)
    conn.commit()
    conn.close()

def save_analysis(platform: str, original_post: str, score: int, analysis: dict, recommendations: dict, improved_post: str) -> int:
    conn = get_db()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute("""
        INSERT INTO history (timestamp, platform, original_post, score, analysis, recommendations, improved_post)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        now,
        platform,
        original_post,
        score,
        json.dumps(analysis),
        json.dumps(recommendations),
        improved_post
    ))
    conn.commit()
    inserted_id = cursor.lastrowid
    conn.close()
    return inserted_id

def get_all_history():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, timestamp, platform, original_post, score, analysis, recommendations, improved_post FROM history ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for row in rows:
        result.append({
            "id": row["id"],
            "timestamp": row["timestamp"],
            "platform": row["platform"],
            "original_post": row["original_post"],
            "score": row["score"],
            "analysis": json.loads(row["analysis"]) if row["analysis"] else {},
            "recommendations": json.loads(row["recommendations"]) if row["recommendations"] else {},
            "improved_post": row["improved_post"]
        })
    return result

def get_history_by_id(record_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, timestamp, platform, original_post, score, analysis, recommendations, improved_post FROM history WHERE id = ?", (record_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return None
        
    return {
        "id": row["id"],
        "timestamp": row["timestamp"],
        "platform": row["platform"],
        "original_post": row["original_post"],
        "score": row["score"],
        "analysis": json.loads(row["analysis"]) if row["analysis"] else {},
        "recommendations": json.loads(row["recommendations"]) if row["recommendations"] else {},
        "improved_post": row["improved_post"]
    }

def delete_history_by_id(record_id: int) -> bool:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM history WHERE id = ?", (record_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def clear_all_history() -> bool:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM history")
    conn.commit()
    conn.close()
    return True
