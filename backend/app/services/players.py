# from sqlalchemy import text
# from app.db import engine
#
# def get_players():
#     with engine.begin() as conn:
#         rows = conn.execute(text("SELECT * FROM players ORDER BY id")).mappings().all()
#         return [dict(r) for r in rows]
from sqlalchemy import text
from app.db import engine

def _initials(name: str) -> str:
    parts = name.split()
    if not parts:
        return ""
    first = parts[0][0]
    second = (parts[-1][0] if len(parts) > 1 else (parts[0][1] if len(parts[0]) > 1 else ""))
    return (first + second).upper()

def get_players():
    with engine.begin() as conn:
        rows = conn.execute(text("""
            SELECT id, number, name, position, height_text
            FROM players
        """)).mappings().all()

    players = []
    for r in rows:
        d = dict(r)
        d["height"] = d.pop("height_text")  # rename for the UI
        d["initials"] = _initials(d["name"])
        players.append(d)

    # Sort by last name like your current UI
    players.sort(key=lambda p: p["name"].split()[-1])
    return players
