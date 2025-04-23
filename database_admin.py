import sqlite3
import pandas as pd

# 1. Open a connection to your .db file
conn = sqlite3.connect("usersdb.sqlite")
cur  = conn.cursor()

# 2. List all tables
cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
print("Tables:", [row[0] for row in cur.fetchall()])

# 3. Inspect the schema of a given table
table = "Storycontent"
# cur.execute(f"PRAGMA table_info({table});")
# print(f"\nSchema for {table}:")
# for cid, name, coltype, notnull, dflt_value, pk in cur.fetchall():
#     print(f"  • {name} ({coltype}){' [PK]' if pk else ''}")


# 2. Display all rows
print(f"Contents of `{table}` before update:")
cur.execute(f"SELECT * FROM {table};")
for row in cur.fetchall():
    print(row)

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
# conn.commit()
conn.close()
