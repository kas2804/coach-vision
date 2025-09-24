# backend/scripts/seed.py
import random
from datetime import date, timedelta
import requests

BASE = "http://127.0.0.1:5000"  # your Flask API

rnd = random.Random(42)  # reproducible randomness

def get_players():
    r = requests.get(f"{BASE}/api/players", timeout=10)
    r.raise_for_status()
    return r.json()  # [{id,number,name,position,height,initials}, ...]

def ensure_match(match_date:str, opponent:str, home_away:str, competition:str|None, team_score:int|None, opp_score:int|None, result:str|None):
    # Try to reuse existing same-date/opponent match, else create
    try:
        r = requests.get(f"{BASE}/api/matches", timeout=10)
        r.raise_for_status()
        for m in r.json():
            if m["match_date"].startswith(match_date) and m["opponent"] == opponent:
                return m["id"]
    except Exception:
        pass
    r = requests.post(f"{BASE}/api/matches", json={
        "match_date": match_date,
        "opponent": opponent,
        "home_away": home_away,
        "competition": competition,
        "team_score": team_score,
        "opp_score": opp_score,
        "result": result
    }, timeout=10)
    r.raise_for_status()
    return r.json()["id"]

def upsert_boxscore(match_id:int, player_ids:list[int]):
    payload = []
    for pid in player_ids:
        minutes = rnd.randint(12, 34)
        fg_att = rnd.randint(4, 16)
        fg_made = rnd.randint(max(1, fg_att//4), max(1, fg_att-2))
        th_att = rnd.randint(0, min(8, fg_att))
        th_made = rnd.randint(0, min(th_att, fg_made))
        ft_att = rnd.randint(0, 6)
        ft_made = rnd.randint(0, ft_att)
        rebo = rnd.randint(0, 4)
        rebd = rnd.randint(1, 8)
        ast  = rnd.randint(0, 7)
        stl  = rnd.randint(0, 3)
        blk  = rnd.randint(0, 3)
        tov  = rnd.randint(0, 4)
        fou  = rnd.randint(0, 4)
        pts  = 2*(fg_made - th_made) + 3*th_made + ft_made
        plus = rnd.randint(-10, 15)
        payload.append({
            "player_id": pid,
            "minutes_played": minutes,
            "fg_made": fg_made,
            "fg_attempted": fg_att,
            "three_made": th_made,
            "three_attempted": th_att,
            "ft_made": ft_made,
            "ft_attempted": ft_att,
            "rebounds_off": rebo,
            "rebounds_def": rebd,
            "assists": ast,
            "steals": stl,
            "blocks": blk,
            "turnovers": tov,
            "fouls": fou,
            "points": pts,
            "plus_minus": plus
        })
    r = requests.post(f"{BASE}/api/matches/{match_id}/stats", json=payload, timeout=20)
    r.raise_for_status()

def upsert_wellness(player_id:int, day:str):
    # ranges chosen to be realistic and to satisfy constraints
    body = {
        "player_id": player_id,
        "log_date": day,
        "sleep_hours": round(rnd.uniform(6.2, 8.7), 1),
        "sleep_quality": rnd.randint(3,5),
        "soreness": rnd.randint(2,6),
        "mood": rnd.randint(3,5),
        "stress": rnd.randint(2,4),
        "illness_flag": rnd.random() < 0.05,
        "comments": None
    }
    r = requests.post(f"{BASE}/api/wellness", json=body, timeout=10)
    r.raise_for_status()

def add_training(player_id:int, day:str):
    # create a session (notes='auto-seed' lets you clean up later if needed)
    session = {
        "player_id": player_id,
        "session_date": day,
        "session_type": rnd.choice(["shooting","conditioning","scrimmage"]),
        "duration_min": rnd.choice([45, 60, 75, 90]),
        "sprint_bursts": rnd.randint(6,16),
        "session_rpe": rnd.randint(4,7),
        "notes": "auto-seed"
    }
    r = requests.post(f"{BASE}/api/training-sessions", json=session, timeout=10)
    r.raise_for_status()
    sid = r.json()["id"]

    # add 1 drill
    drill = {
        "drill_name": rnd.choice(["baseline shuttles","elbow jumpers","corner 3s"]),
        "reps": rnd.randint(6,14),
        "distance_per_rep_m": rnd.choice([14, 20, 28]),
        "intensity_band": rnd.choice(["easy","moderate","hard"])
    }
    r = requests.post(f"{BASE}/api/training-sessions/{sid}/drills", json=drill, timeout=10)
    r.raise_for_status()

def mark_attendance(player_id:int, day:str, present:bool):
    body = {
        "player_id": player_id,
        "session_date": day,
        "attended": present,
        "participation_score": round(rnd.uniform(0.6, 1.0), 2) if present else 0.0
    }
    r = requests.post(f"{BASE}/api/attendance", json=body, timeout=10)
    r.raise_for_status()

def create_injury(player_id:int, day:str):
    body = {
        "player_id": player_id,
        "injury_date": day,
        "injury_type": rnd.choice(["ankle","hamstring","knee"]),
        "severity": rnd.randint(1,3),
        "status": "active",
        "expected_return_date": None
    }
    r = requests.post(f"{BASE}/api/injuries", json=body, timeout=10)
    r.raise_for_status()

def main():
    players = get_players()
    ids = [p["id"] for p in players]
    if not ids:
        print("No players found. Seed your players first.")
        return

    today = date.today()
    past = (today - timedelta(days=1)).isoformat()
    future = (today + timedelta(days=3)).isoformat()

    # 1) One past match (with stats for all players)
    mid_past = ensure_match(past, "Warriors", "Home", "Friendly", team_score= rnd.randint(70,95), opp_score=rnd.randint(65,90), result=rnd.choice(["W","L"]))
    upsert_boxscore(mid_past, ids)

    # 2) One upcoming match (no stats)
    ensure_match(future, "Raptors", "Away", "League", team_score=None, opp_score=None, result=None)

    # 3) Last 7 days wellness + some training + attendance for today
    for d in range(7):
        day = (today - timedelta(days=d)).isoformat()
        for pid in ids:
            upsert_wellness(pid, day)
            # about half the players trained on a given day
            if rnd.random() < 0.5:
                add_training(pid, day)

    # Attendance for today (80% present)
    today_s = today.isoformat()
    for pid in ids:
        mark_attendance(pid, today_s, present=(rnd.random() < 0.8))

    # 4) A couple of injuries
    if len(ids) >= 2:
        create_injury(ids[0], today_s)
        create_injury(ids[-1], today_s)

    print("Seed complete.")
    # Optional: show the coach overview quickly
    r = requests.get(f"{BASE}/api/coach/overview", timeout=10)
    if r.ok:
        print("Overview:", r.json())

if __name__ == "__main__":
    main()
