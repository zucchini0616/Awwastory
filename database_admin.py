import sqlite3
import pandas as pd

# 1. Open a connection to your .db file
conn = sqlite3.connect("usersdb.sqlite")
cur  = conn.cursor()

# 2. List all tables
cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
print("Tables:", [row[0] for row in cur.fetchall()])

# 3. Inspect the schema of a given table
table = "Questions"
cur.execute(f"PRAGMA table_info({table});")
print(f"\nSchema for {table}:")
for cid, name, coltype, notnull, dflt_value, pk in cur.fetchall():
    print(f"  • {name} ({coltype}){' [PK]' if pk else ''}")


# # 2. Display all rows
print(f"Contents of `{table}` before update:")
cur.execute(f" SELECT DISTINCT
        UA.user_id,
        U.Username,
        UA.story_id,
        S.storyname,
        UA.survey_answers,
        UA.activity_timestamp,
        GROUP_CONCAT(DISTINCT q.question, '|||') AS questions
        FROM Useractivity UA
        JOIN Users U    ON U.Id= UA.user_id
        JOIN Stories S  ON S.storyid   = UA.story_id
        LEFT JOIN Storycontent sc 
        ON sc.storyid = UA.story_id
        LEFT JOIN Questions q 
        ON q.QuestionNofk = sc.pageid
        GROUP BY
        UA.user_id,
        UA.story_id,
        UA.survey_answers,
        UA.activity_timestamp
        ORDER BY UA.activity_timestamp DESC")
for row in cur.fetchall():
    print(row)
# 1) Clear all records in Useractivity
# cur.execute("DELETE FROM Useractivity;")
# print(f"Deleted {cur.rowcount} rows from Useractivity")

# 2) Add a new column for the activity timestamp
#    (SQLite only allows ADD COLUMN; this will default to the current time on each insertion)
# try:
#     cur.execute("""
#         ALTER TABLE Useractivity
#         ADD COLUMN activity_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP;
#     """)
#     print("Added column 'activity_timestamp' to Useractivity")
# except sqlite3.OperationalError as e:
#     # Will error if the column already exists
#     print("Could not add column (it may already exist):", e)

# cur.execute("""
#     UPDATE Storycontent
#        SET content = REPLACE(
#          content,
#          'Awwastory-main/images/1/',
#          'images/1/'
#        )
#      WHERE storyid = ?;
# """, (1,))
# content_updated = cur.rowcount


# cur.execute("""
#     UPDATE Storycontent
#        SET content = REPLACE(
#          content,
#          'Awwastory-main/images/2/',
#          'images/2/'
#        )
#      WHERE storyid = ?;
# """, (2,))
# content_updated = cur.rowcount

# # Commit & close
conn.commit()
conn.close()
