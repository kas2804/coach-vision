import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
url = os.environ["DATABASE_URL"]
# normalize scheme if needed
if url.startswith("postgres://"):
    url = url.replace("postgres://", "postgresql://", 1)

engine = create_engine(url, pool_pre_ping=True)

with engine.begin() as conn:
    # sanity: show server version
    ver = conn.execute(text("SELECT version();")).scalar()
    print("Connected to:", ver)

    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS players (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            position TEXT,
            number INT
        );
    """))
    conn.execute(text("""
        INSERT INTO players (name, position, number)
        VALUES ('Emma Chen','FW',9), ('Alex Rivera','MF',8)
        ON CONFLICT DO NOTHING;
    """))
    rows = conn.execute(text("SELECT id, name, position, number FROM players;")).fetchall()
    print("Rows:", rows)
