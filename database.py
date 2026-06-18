import sqlite3
import datetime

def init_db():
    conn = sqlite3.connect("justice.db")
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS hearings (id INTEGER PRIMARY KEY AUTOINCREMENT, defendant TEXT, charge TEXT, risk_level TEXT, hearing_date TEXT, created_at TEXT)")
    conn.commit()
    conn.close()

def save_hearing(defendant, charge, risk_level, hearing_date):
    conn = sqlite3.connect("justice.db")
    cursor = conn.cursor()
    created_at = datetime.datetime.now().isoformat()
    cursor.execute("INSERT INTO hearings (defendant, charge, risk_level, hearing_date, created_at) VALUES (?, ?, ?, ?, ?)", (defendant, charge, risk_level, hearing_date, created_at))
    conn.commit()
    conn.close()

def get_all_hearings():
    conn = sqlite3.connect("justice.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM hearings")
    hearings = cursor.fetchall()
    conn.close()
    return hearings