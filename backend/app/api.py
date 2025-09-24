# backend/app/api.py
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from sqlalchemy import text
from datetime import date, timedelta

from app.services.players import get_players
from app.db import engine



app = Flask(__name__)
CORS(app)

# -------- Players (already working) --------
@app.get("/api/players")
def api_players():
    return jsonify(get_players())

# -------- Health check (optional) --------
@app.get("/api/health")
def api_health():
    return {"ok": True}

# -------- Matches (create) --------
@app.post("/api/matches")
def create_match():
    data = request.get_json(force=True)
    for k in ("match_date", "opponent", "home_away"):
        if k not in data:
            abort(400, f"Missing field: {k}")
    try:
        with engine.begin() as conn:
            row = conn.execute(text("""
                INSERT INTO matches
                (match_date, opponent, home_away, competition, team_score, opp_score, result)
                VALUES (:match_date, :opponent, :home_away, :competition, :team_score, :opp_score, :result)
                RETURNING id
            """), {
                "match_date":   data["match_date"],
                "opponent":     data["opponent"],
                "home_away":    data["home_away"],  # 'Home' | 'Away'
                "competition":  data.get("competition"),
                "team_score":   data.get("team_score"),
                "opp_score":    data.get("opp_score"),
                "result":       data.get("result")
            }).first()
        return {"id": row[0]}, 201
    except Exception as e:
        abort(400, str(e))

# -------- Box score (create/upsert) --------
@app.post("/api/matches/<int:match_id>/stats")
def upsert_box_score(match_id: int):
    payload = request.get_json(force=True)
    if not isinstance(payload, list):
        abort(400, "Expected a JSON array of player stat objects")
    try:
        with engine.begin() as conn:
            for s in payload:
                s["match_id"] = match_id
                conn.execute(text("""
                  INSERT INTO player_match_stats
                  (match_id, player_id, minutes_played, fg_made, fg_attempted, three_made, three_attempted,
                   ft_made, ft_attempted, rebounds_off, rebounds_def, assists, steals, blocks, turnovers,
                   fouls, points, plus_minus)
                  VALUES
                  (:match_id, :player_id, :minutes_played, :fg_made, :fg_attempted, :three_made, :three_attempted,
                   :ft_made, :ft_attempted, :rebounds_off, :rebounds_def, :assists, :steals, :blocks, :turnovers,
                   :fouls, :points, :plus_minus)
                  ON CONFLICT (match_id, player_id) DO UPDATE SET
                    minutes_played=EXCLUDED.minutes_played,
                    fg_made=EXCLUDED.fg_made,
                    fg_attempted=EXCLUDED.fg_attempted,
                    three_made=EXCLUDED.three_made,
                    three_attempted=EXCLUDED.three_attempted,
                    ft_made=EXCLUDED.ft_made,
                    ft_attempted=EXCLUDED.ft_attempted,
                    rebounds_off=EXCLUDED.rebounds_off,
                    rebounds_def=EXCLUDED.rebounds_def,
                    assists=EXCLUDED.assists,
                    steals=EXCLUDED.steals,
                    blocks=EXCLUDED.blocks,
                    turnovers=EXCLUDED.turnovers,
                    fouls=EXCLUDED.fouls,
                    points=EXCLUDED.points,
                    plus_minus=EXCLUDED.plus_minus
                """), s)
        return {"ok": True}, 201
    except Exception as e:
        abort(400, str(e))

# -------- Wellness --------
@app.post("/api/wellness")
def create_wellness():
    data = request.get_json(force=True)
    for k in ("player_id", "log_date"):
        if k not in data:
            abort(400, f"Missing field: {k}")
    try:
        with engine.begin() as conn:
            conn.execute(text("""
                INSERT INTO wellness_logs
                (player_id, log_date, sleep_hours, sleep_quality, soreness, mood, stress, illness_flag, comments)
                VALUES (:player_id, :log_date, :sleep_hours, :sleep_quality, :soreness, :mood, :stress, :illness_flag, :comments)
                ON CONFLICT (player_id, log_date) DO UPDATE SET
                  sleep_hours=EXCLUDED.sleep_hours,
                  sleep_quality=EXCLUDED.sleep_quality,
                  soreness=EXCLUDED.soreness,
                  mood=EXCLUDED.mood,
                  stress=EXCLUDED.stress,
                  illness_flag=EXCLUDED.illness_flag,
                  comments=EXCLUDED.comments
            """), data)
        return {"ok": True}, 201
    except Exception as e:
        abort(400, str(e))

# -------- Training session + drills --------
@app.post("/api/training-sessions")
def create_training_session():
    data = request.get_json(force=True)
    for k in ("player_id", "session_date", "session_type", "duration_min"):
        if k not in data:
            abort(400, f"Missing field: {k}")
    try:
        with engine.begin() as conn:
            row = conn.execute(text("""
              INSERT INTO training_sessions
              (player_id, session_date, session_type, duration_min, sprint_bursts, session_rpe, notes)
              VALUES (:player_id, :session_date, :session_type, :duration_min, :sprint_bursts, :session_rpe, :notes)
              RETURNING id
            """), data).first()
        return {"id": row[0]}, 201
    except Exception as e:
        abort(400, str(e))

@app.post("/api/training-sessions/<int:session_id>/drills")
def add_drill(session_id: int):
    data = request.get_json(force=True)
    if "drill_name" not in data:
        abort(400, "Missing field: drill_name")
    data["training_session_id"] = session_id
    try:
        with engine.begin() as conn:
            conn.execute(text("""
              INSERT INTO drill_logs
              (training_session_id, drill_name, reps, distance_per_rep_m, intensity_band)
              VALUES (:training_session_id, :drill_name, :reps, :distance_per_rep_m, :intensity_band)
            """), data)
        return {"ok": True}, 201
    except Exception as e:
        abort(400, str(e))

# -------- Attendance --------
@app.post("/api/attendance")
def mark_attendance():
    data = request.get_json(force=True)
    for k in ("player_id", "session_date", "attended"):
        if k not in data:
            abort(400, f"Missing field: {k}")
    try:
        with engine.begin() as conn:
            conn.execute(text("""
              INSERT INTO attendance
              (player_id, session_date, attended, participation_score)
              VALUES (:player_id, :session_date, :attended, :participation_score)
              ON CONFLICT (player_id, session_date) DO UPDATE SET
                attended=EXCLUDED.attended,
                participation_score=EXCLUDED.participation_score
            """), data)
        return {"ok": True}, 201
    except Exception as e:
        abort(400, str(e))

# -------- Injuries --------
@app.post("/api/injuries")
def create_injury():
    data = request.get_json(force=True)
    for k in ("player_id", "injury_date", "injury_type", "severity", "status"):
        if k not in data:
            abort(400, f"Missing field: {k}")
    try:
        with engine.begin() as conn:
            conn.execute(text("""
              INSERT INTO injury_logs
              (player_id, injury_date, injury_type, severity, status, expected_return_date)
              VALUES (:player_id, :injury_date, :injury_type, :severity, :status, :expected_return_date)
            """), data)
        return {"ok": True}, 201
    except Exception as e:
        abort(400, str(e))

# -------- Read matches --------
@app.get("/api/matches")
def list_matches():
    with engine.begin() as conn:
        rows = conn.execute(text("""
            SELECT id, match_date, opponent, home_away, competition,
                   team_score, opp_score, result
            FROM matches
            ORDER BY match_date DESC, id DESC
        """)).mappings().all()
    return jsonify([dict(r) for r in rows])

# -------- Read box score for one match --------
@app.get("/api/matches/<int:match_id>/stats")
def get_match_stats(match_id: int):
    with engine.begin() as conn:
        rows = conn.execute(text("""
            SELECT
              pms.match_id, pms.player_id,
              pl.number, pl.name,
              pms.minutes_played, pms.fg_made, pms.fg_attempted,
              pms.three_made, pms.three_attempted,
              pms.ft_made, pms.ft_attempted,
              pms.rebounds_off, pms.rebounds_def,
              pms.assists, pms.steals, pms.blocks, pms.turnovers,
              pms.fouls, pms.points, pms.plus_minus
            FROM player_match_stats pms
            JOIN players pl ON pl.id = pms.player_id
            WHERE pms.match_id = :mid
            ORDER BY pl.number
        """), {"mid": match_id}).mappings().all()
    return jsonify([dict(r) for r in rows])

# -------- Team Averages (NEW ENDPOINT) --------
@app.get("/api/team/averages")
def get_team_averages():
    with engine.begin() as conn:
        # Calculate team averages across all players and matches
        team_stats = conn.execute(text("""
            SELECT
                COUNT(DISTINCT pms.player_id) as total_players,
                COUNT(DISTINCT pms.match_id) as total_matches,
                COUNT(*) as total_stat_lines,
                
                -- Shooting (Field Goal Percentage)
                ROUND(
                    (SUM(pms.fg_made)::float / NULLIF(SUM(pms.fg_attempted), 0)) * 100, 1
                ) as team_fg_pct,
                
                -- Passing (Assists per game)
                ROUND(
                    SUM(pms.assists)::float / COUNT(DISTINCT pms.match_id), 1
                ) as team_apg,
                
                -- Defense (Steals per game)
                ROUND(
                    SUM(pms.steals)::float / COUNT(DISTINCT pms.match_id), 1
                ) as team_spg,
                
                -- Rebounding (Rebounds per game)
                ROUND(
                    SUM(pms.rebounds_off + pms.rebounds_def)::float / COUNT(DISTINCT pms.match_id), 1
                ) as team_rpg,
                
                -- Endurance (Minutes per game)
                ROUND(
                    SUM(pms.minutes_played)::float / COUNT(DISTINCT pms.match_id), 1
                ) as team_mpg
                
            FROM player_match_stats pms
        """)).mappings().first()
        
        return jsonify(dict(team_stats))

# --- helper ---
def _safe_div(a, b):
    return (a / b) if b else 0.0

# --- Athlete overview (by player name) ---
@app.get("/api/athletes/<player_name>/overview")
def athlete_overview(player_name: str):
    with engine.begin() as conn:
        # 1) Resolve player
        pl = conn.execute(text("""
            SELECT id, name, position, number, height_text
            FROM players
            WHERE name = :name
            LIMIT 1
        """), {"name": player_name}).mappings().first()
        if not pl:
            abort(404, "Player not found")
        pid = pl["id"]

        # 2) Totals for this player (career)
        tot = conn.execute(text("""
                SELECT
                    COUNT(*)::int AS games,
                    COALESCE(SUM(points),0)::int AS pts,
                    COALESCE(SUM(assists),0)::int AS ast,
                    COALESCE(SUM(rebounds_off + rebounds_def),0)::int AS reb,
                    COALESCE(SUM(steals),0)::int AS stl,
                    COALESCE(SUM(blocks),0)::int AS blk,
                    COALESCE(SUM(fg_made),0)::int AS fgm,
                    COALESCE(SUM(fg_attempted),0)::int AS fga,
                    COALESCE(SUM(three_made),0)::int AS tpm,
                    COALESCE(SUM(three_attempted),0)::int AS tpa
                FROM player_match_stats
                WHERE player_id = :pid
        """), {"pid": pid}).mappings().first()

        games = tot["games"] or 0
        fgm, fga = tot["fgm"] or 0, tot["fga"] or 0
        tpm, tpa = tot["tpm"] or 0, tot["tpa"] or 0
        fg_pct = round(_safe_div(fgm, fga) * 100, 1) if fga else 0.0
        three_pct = round(_safe_div(tpm, tpa) * 100, 1) if tpa else 0.0

        avg_points = round(_safe_div(tot["pts"] or 0, games), 1) if games else 0.0
        avg_assists = round(_safe_div(tot["ast"] or 0, games), 1) if games else 0.0

        # 2a) Rebounds per game (last 7 days)
        today = date.today()
        start = today - timedelta(days=6)
        reb_7d = conn.execute(text("""
                SELECT COALESCE(SUM(pms.rebounds_off + pms.rebounds_def),0) AS rebounds,
                             COUNT(DISTINCT m.id) AS games
                FROM player_match_stats pms
                JOIN matches m ON m.id = pms.match_id
                WHERE pms.player_id = :pid AND m.match_date BETWEEN :start AND :end
        """), {"pid": pid, "start": start, "end": today}).mappings().first()
        rebounds_7d = reb_7d["rebounds"] or 0
        games_7d = reb_7d["games"] or 1
        rebounds_pg_7d = rebounds_7d / games_7d if games_7d else 0

        # 2b) Sleep (last 7 days)
        sleep_7d = conn.execute(text("""
                SELECT AVG(sleep_hours) AS sleep
                FROM wellness_logs
                WHERE player_id = :pid AND log_date BETWEEN :start AND :end
        """), {"pid": pid, "start": start, "end": today}).scalar()

        # 3) Weekly performance = last 6 games (oldest→newest)
        rows = conn.execute(text("""
            SELECT m.match_date::date AS d, p.points, p.assists, p.steals
            FROM player_match_stats p
            JOIN matches m ON m.id = p.match_id
            WHERE p.player_id = :pid
            ORDER BY m.match_date DESC, p.match_id DESC
            LIMIT 6
        """), {"pid": pid}).mappings().all()
        weekly = list(reversed(rows))
        weekly_perf = []
        for i, r in enumerate(weekly, start=1):
            weekly_perf.append({
                "week": f"W{i}",
                "points": int(r["points"] or 0),
                "assists": int(r["assists"] or 0),
                "steals": int(r["steals"] or 0),
            })

        # 4) Monthly stats = last 5 months, by match month
        monthly = conn.execute(text("""
            SELECT to_char(date_trunc('month', m.match_date), 'Mon') AS mon,
                   COALESCE(SUM(p.points),0)::int AS points,
                   COALESCE(SUM(p.assists),0)::int AS assists
            FROM player_match_stats p
            JOIN matches m ON m.id = p.match_id
            WHERE p.player_id = :pid
            GROUP BY 1
            ORDER BY min(m.match_date) DESC
            LIMIT 5
        """), {"pid": pid}).mappings().all()
        monthly_stats = list(reversed([{"month": r["mon"], "points": int(r["points"]), "assists": int(r["assists"])} for r in monthly]))

        # 5) Personal bests
        bests = conn.execute(text("""
            SELECT
              COALESCE(MAX(points),0)::int AS best_pts,
              COALESCE(MAX(assists),0)::int AS best_ast
            FROM player_match_stats
            WHERE player_id = :pid
        """), {"pid": pid}).mappings().first()

        # 6) Team “averages” for skill comparisons (per player-game row)
        team = conn.execute(text("""
            SELECT
              COUNT(*)::int AS rows,
              COALESCE(SUM(points),0)::int AS pts,
              COALESCE(SUM(assists),0)::int AS ast,
              COALESCE(SUM(rebounds_off + rebounds_def),0)::int AS reb,
              COALESCE(SUM(steals),0)::int AS stl,
              COALESCE(SUM(blocks),0)::int AS blk,
              COALESCE(SUM(fg_made),0)::int AS fgm,
              COALESCE(SUM(fg_attempted),0)::int AS fga
            FROM player_match_stats
        """)).mappings().first()
        tr = max(team["rows"] or 1, 1)
        team_ast_pg = _safe_div(team["ast"] or 0, tr)
        team_reb_pg = _safe_div(team["reb"] or 0, tr)
        team_def_pg = _safe_div((team["stl"] or 0) + (team["blk"] or 0), tr)
        team_fg_pct = _safe_div(team["fgm"] or 0, team["fga"] or 1) * 100

        # player per-game proxies
        ast_pg = _safe_div(tot["ast"] or 0, games) if games else 0.0
        reb_pg = _safe_div(tot["reb"] or 0, games) if games else 0.0
        def_pg = _safe_div((tot["stl"] or 0) + (tot["blk"] or 0), games) if games else 0.0

        # 7) Build skill scores (0–100-ish)
        def clamp(x): return max(0, min(100, x))
        shooting = clamp(fg_pct)
        passing  = clamp(30 + 50 * _safe_div(ast_pg, team_ast_pg or 1))
        rebounding = clamp(30 + 50 * _safe_div(reb_pg, team_reb_pg or 1))
        defense  = clamp(35 + 45 * _safe_div(def_pg, team_def_pg or 1))
        endurance = 70  # simple placeholder unless you want to compute from training_sessions
        dribbling = 75  # placeholder (no turnovers metric in your schema)

        skills = [
            {"skill": "Shooting",   "current": round(shooting),   "teamAvg": round(team_fg_pct), "icon": "🎯"},
            {"skill": "Passing",    "current": round(passing),    "teamAvg": 70,                 "icon": "🎯"},
            {"skill": "Rebounding", "current": round(rebounding), "teamAvg": 72,                 "icon": "🏀"},
            {"skill": "Defense",    "current": round(defense),    "teamAvg": 68,                 "icon": "🛡️"},
            {"skill": "Endurance",  "current": round(endurance),  "teamAvg": 70,                 "icon": "💪"},
            {"skill": "Dribbling",  "current": round(dribbling),  "teamAvg": 74,                 "icon": "⚡"},
        ]

        payload = {
            "profile": {
                "id": pid,
                "name": pl["name"],
                "position": pl["position"],
                "number": pl["number"],
                "height": pl["height_text"],
            },
            "summary": {
                "avgPoints": avg_points,
                "avgAssists": avg_assists,
                "fgPct": fg_pct,
                "games": games,
                "rebounds7d": round(rebounds_pg_7d, 2) if rebounds_pg_7d is not None else None,
                "sleep7d": float(round(float(sleep_7d), 2)) if sleep_7d is not None else None,
            },  
            "weeklyPerformance": weekly_perf,
            "monthlyStats": monthly_stats,
            "personalBests": {
                "points": bests["best_pts"] or 0,
                "assists": bests["best_ast"] or 0,
                "threePct": three_pct,
            },
            "skills": skills,
        }
    return jsonify(payload)

# --- /api/coach/overview ---
@app.get("/api/coach/overview")
def coach_overview():
    today = date.today()
    start = today - timedelta(days=6)  # last 7 days inclusive

    with engine.begin() as conn:
        # Players & injuries
        total_players = conn.execute(text("SELECT COUNT(*) FROM players")).scalar() or 0
        injured_players = conn.execute(text("""
            SELECT COUNT(DISTINCT player_id)
            FROM injury_logs
            WHERE status = 'active'
        """)).scalar() or 0

        # Next match (upcoming)
        next_match = conn.execute(text("""
            SELECT id,
                   match_date::text AS match_date,   -- "YYYY-MM-DD"
                   opponent, home_away, competition
            FROM matches
            WHERE match_date >= CURRENT_DATE
            ORDER BY match_date ASC, id ASC
            LIMIT 1
        """)).mappings().first()
        next_match = dict(next_match) if next_match else None

        # Win rate (all games so far)
        wr = conn.execute(text("""
            SELECT
              COUNT(*) FILTER (WHERE result='W')::int AS wins,
              COUNT(*)::int AS games
            FROM matches
        """)).mappings().first()
        wins = wr["wins"] or 0
        games = wr["games"] or 0
        win_rate = round(_safe_div(wins, games) * 100, 1) if games else 0.0

        # Weekly training minutes per day
        train_rows = conn.execute(text("""
            SELECT 
              session_date::date AS d, 
              SUM(avg_duration)::float AS mins
            FROM (
              SELECT 
                session_date, 
                session_type, 
                AVG(duration_min) AS avg_duration
              FROM training_sessions
              WHERE session_date BETWEEN :start AND :end
              GROUP BY session_date, session_type
            ) sub
            GROUP BY d
        """), {"start": start, "end": today}).mappings().all()
        minutes_by_day = {r["d"].isoformat(): r["mins"] for r in train_rows}

        weekly_training_time_dots = []
        weekly_drill_time_hrs = 0.0
        for i in range(7):
            d = (start + timedelta(days=i)).isoformat()
            mins = minutes_by_day.get(d, 0)
            hrs = mins / 60.0
            weekly_training_time_dots.append({"date": d, "hours": round(hrs, 2)})
            weekly_drill_time_hrs += hrs

        # Weekly sprint bursts
        sprint_bursts = conn.execute(text("""
            SELECT COALESCE(SUM(sprint_bursts),0)
            FROM training_sessions
            WHERE session_date BETWEEN :start AND :end
        """), {"start": start, "end": today}).scalar() or 0

        # Total drill distance (meters) over last 7 days
        total_drill_distance_m = conn.execute(text("""
            SELECT COALESCE(SUM(dl.reps * COALESCE(dl.distance_per_rep_m,0)),0)
            FROM drill_logs dl
            JOIN training_sessions ts ON ts.id = dl.training_session_id
            WHERE ts.session_date BETWEEN :start AND :end
        """), {"start": start, "end": today}).scalar() or 0.0
        total_drill_distance_m = float(total_drill_distance_m)
        # Engagement series (attendance %) per day
        att_rows = conn.execute(text("""
            SELECT session_date::date AS d,
                   SUM(CASE WHEN attended THEN 1 ELSE 0 END)::int AS present
            FROM attendance
            WHERE session_date BETWEEN :start AND :end
            GROUP BY d
        """), {"start": start, "end": today}).mappings().all()
        present_by_day = {r["d"].isoformat(): r["present"] for r in att_rows}
        denom = total_players if total_players > 0 else 1
        engagement_series = []
        for i in range(7):
            d = (start + timedelta(days=i)).isoformat()
            pct = round(_safe_div(present_by_day.get(d, 0), denom) * 100, 1)
            engagement_series.append({"date": d, "percent": pct})

        # Tasks completion (optional; 0 if none)
        task_stats = conn.execute(text("""
            SELECT
              COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE tc.completed) ::int AS done
            FROM team_tasks t
            LEFT JOIN task_completions tc ON tc.task_id = t.id
        """)).mappings().first()
        total_tasks = (task_stats["total"] or 0) if task_stats else 0
        done_tasks  = (task_stats["done"] or 0) if task_stats else 0
        completion_rate = round(_safe_div(done_tasks, total_tasks) * 100, 1) if total_tasks else 0.0

        # Game stats (last 7 days)
        gm = conn.execute(text("""
            SELECT
              COALESCE(SUM(pms.fg_made),0)::int AS fg_made,
              COALESCE(SUM(pms.fg_attempted),0)::int AS fg_att,
              COALESCE(SUM(pms.rebounds_off + pms.rebounds_def),0)::int AS rebounds,
              COALESCE(SUM(pms.assists),0)::int AS assists,
              COALESCE(SUM(pms.minutes_played),0)::int AS minutes,
              COALESCE(SUM(pms.fg_attempted),0)::int AS shots
            FROM player_match_stats pms
            JOIN matches m ON m.id = pms.match_id
            WHERE m.match_date BETWEEN :start AND :end
        """), {"start": start, "end": today}).mappings().first()
        team_fg_pct_7d = round(_safe_div(gm["fg_made"], gm["fg_att"])*100, 1) if gm["fg_att"] else 0.0

        # Wellness summaries (last 7 days)
        wl = conn.execute(text("""
            SELECT
              AVG(sleep_hours)::float   AS sleep_hours,
              AVG(sleep_quality)::float AS sleep_quality,
              AVG(soreness)::float      AS soreness,
              AVG(mood)::float          AS mood,
              AVG(stress)::float        AS stress
            FROM wellness_logs
            WHERE log_date BETWEEN :start AND :end
        """), {"start": start, "end": today}).mappings().first() or {}

        # Simple 0–100 wellness score (no devices; tweak weights if you want)
        def norm01(x, lo, hi):
            if x is None:
                return None
            return max(0.0, min(1.0, (x - lo) / (hi - lo))) if hi > lo else 0.0

        sh = wl.get("sleep_hours")
        sq = wl.get("sleep_quality")
        sr = wl.get("soreness")
        md = wl.get("mood")
        st = wl.get("stress")

        comp = []
        comp.append(0.25 * min((sh or 0)/8.0, 1.0))              # hours vs 8h target
        comp.append(0.25 * (norm01(sq,1,5) or 0))                # sleep quality
        comp.append(0.20 * (norm01(md,1,5) or 0))                # mood
        comp.append(0.15 * (1 - (norm01(st,1,5) or 0)))          # lower stress = better
        comp.append(0.15 * (1 - (norm01(sr,1,10) or 0)))         # lower soreness = better
        wellness_score = round(sum(comp) * 100, 1)
        sleep_avg = round(sh, 2) if sh is not None else None


        # Avg performance (hrs) = team training minutes last 7d / players
        total_train_mins_7d = sum(v["hours"] for v in weekly_training_time_dots) * 60
        avg_performance_hrs = round(_safe_div(total_train_mins_7d, total_players) / 60.0, 2) if total_players else 0.0

        # --- Top improved player (PPG delta last 7d vs previous 7d) ---
        prev_start = today - timedelta(days=13)
        prev_end   = today - timedelta(days=7)

        def _ppg_rows(a, b):
            # NOTE: date filter is in the JOIN to preserve left-join behavior
            return conn.execute(text("""
                SELECT
                  p.id AS player_id, p.name, p.position, p.number,
                  COALESCE(SUM(pms.points),0)::int AS pts,
                  COUNT(DISTINCT pms.match_id)::int AS games
                FROM players p
                LEFT JOIN player_match_stats pms
                  ON pms.player_id = p.id
                LEFT JOIN matches m
                  ON m.id = pms.match_id
                 AND m.match_date BETWEEN :a AND :b
                GROUP BY p.id, p.name, p.position, p.number
            """), {"a": a, "b": b}).mappings().all()

        last_rows = _ppg_rows(start, today)
        prev_rows = _ppg_rows(prev_start, prev_end)

        last_map = {r["player_id"]: r for r in last_rows}
        prev_map = {r["player_id"]: r for r in prev_rows}

        best = None
        for pid, r in last_map.items():
            g_last = r.get("games", 0) or 0
            prev_r = prev_map.get(pid, {}) or {}
            g_prev = prev_r.get("games", 0) or 0

            ppg_last = (r.get("pts", 0) / g_last) if g_last else 0.0
            ppg_prev = (prev_r.get("pts", 0) / g_prev) if g_prev else 0.0
            delta = ppg_last - ppg_prev

            if best is None or delta > best["delta"]:
                best = {
                    "player_id": pid,
                    "name": r["name"],
                    "position": r.get("position"),
                    "number": r.get("number"),
                    "metric": "PPG",
                    "delta": round(delta, 1),
                    "ppg_last": round(ppg_last, 1),
                    "ppg_prev": round(ppg_prev, 1),
                }

        # --- Top improvements (team stats deltas) ---
        def get_stat_avg(stat, start, end):
            row = conn.execute(text(f"""
                SELECT AVG({stat}) AS avg_stat
                FROM player_match_stats pms
                JOIN matches m ON m.id = pms.match_id
                WHERE m.match_date BETWEEN :start AND :end
            """), {"start": start, "end": end}).mappings().first()
            return float(row["avg_stat"] or 0)

        # Passing accuracy (assists per game)
        passing_last = get_stat_avg("assists", start, today)
        passing_prev = get_stat_avg("assists", prev_start, prev_end)
        passing_delta = ((passing_last - passing_prev) / passing_prev * 100) if passing_prev else (100 if passing_last else 0)

        # Defensive blocks (blocks per game)
        blocks_last = get_stat_avg("blocks", start, today)
        blocks_prev = get_stat_avg("blocks", prev_start, prev_end)
        blocks_delta = ((blocks_last - blocks_prev) / blocks_prev * 100) if blocks_prev else (100 if blocks_last else 0)

        # Shooting accuracy (FG%)
        fg_last = get_stat_avg("CAST(fg_made AS float) / NULLIF(fg_attempted,0)", start, today)
        fg_prev = get_stat_avg("CAST(fg_made AS float) / NULLIF(fg_attempted,0)", prev_start, prev_end)
        shooting_delta = ((fg_last - fg_prev) / fg_prev * 100) if fg_prev else (100 if fg_last else 0)

        topImprovements = [
            {"title": "Passing accuracy", "deltaPct": round(passing_delta, 1)},
            {"title": "Defensive blocks", "deltaPct": round(blocks_delta, 1)},
            {"title": "Shooting accuracy", "deltaPct": round(shooting_delta, 1)},
        ]


        payload = {
            "nextMatch": next_match,                       # {id, match_date, opponent, home_away, competition} | null
            "avgPerformanceHrs": avg_performance_hrs,      # per-player avg training hours (last 7d)
            "injuriesCount": injured_players,              # distinct active injuries
            "winRate": win_rate,                           # %
            "weeklyDrillTimeHrs": round(weekly_drill_time_hrs, 2),
            "totalDrillDistanceM": round(total_drill_distance_m, 1),
            "sprintBursts": int(sprint_bursts),
            "engagementSeries": engagement_series,         # [{date, percent}]
            "weeklyTrainingTimeDots": weekly_training_time_dots,  # [{date, hours}]
            "completionRate": completion_rate,             # %
            "activePlayers": max(total_players - injured_players, 0),

            # Wellness card
            "wellnessScore": wellness_score,               # 0–100
            "sleepAvg": sleep_avg,                         # hours
            "fgPct7d": team_fg_pct_7d,                     # %
            "rebounds7d": int(gm["rebounds"]),
            "assists7d": int(gm["assists"]),

            # Workload (from games)
            "shotsAttempted7d": int(gm["shots"]),
            "courtTimeMin7d": int(gm["minutes"]),

            # Add the new top improved player object
            "topImprovedPlayer": best,
            # Add top improvements array
            "topImprovements": topImprovements,
        }

    return jsonify(payload)

# -------- Live coach alerts --------
@app.get("/api/coach/alerts")
def coach_alerts():
    def normalize_severity(sev) -> str:
        """
        Accepts: 'high'|'medium'|'low' (any case) OR numeric (e.g., 1..10).
        Returns: 'high' | 'medium' | 'low'
        """
        if sev is None:
            return "medium"
        # numeric?
        if isinstance(sev, (int, float)):
            return "high" if sev >= 8 else ("medium" if sev >= 4 else "low")
        # string?
        s = str(sev).strip().lower()
        if s in ("high", "medium", "low"):
            return s
        try:
            f = float(s)
            return "high" if f >= 8 else ("medium" if f >= 4 else "low")
        except Exception:
            return "medium"

    today = date.today()
    yday = today - timedelta(days=1)
    alerts = []

    with engine.begin() as conn:
        # Active injuries → one alert per injured player
        inj = conn.execute(text("""
            SELECT il.player_id, p.name, il.injury_type, il.severity
            FROM injury_logs il
            JOIN players p ON p.id = il.player_id
            WHERE il.status = 'active'
            ORDER BY p.name
        """)).mappings().all()

        for r in inj:
            alerts.append({
                "id": f"injury-{r['player_id']}",
                "type": "injury",
                "title": "Injury Update",
                "description": f"{r['name']} — {r.get('injury_type') or 'Injury'}",
                "player": r["name"],
                "severity": normalize_severity(r.get("severity")),
            })

        # Yesterday/today absences
        abs_rows = conn.execute(text("""
            SELECT a.player_id, p.name, a.session_date::text AS d
            FROM attendance a
            JOIN players p ON p.id = a.player_id
            WHERE a.session_date BETWEEN :d1 AND :d2
              AND COALESCE(a.attended, FALSE) = FALSE
            ORDER BY a.session_date DESC, p.name
        """), {"d1": yday, "d2": today}).mappings().all()

        for r in abs_rows:
            alerts.append({
                "id": f"absence-{r['player_id']}-{r['d']}",
                "type": "absence",
                "title": "Session Missed",
                "description": f"{r['name']} missed training ({r['d']})",
                "player": r["name"],
                "severity": "medium",
            })

        # Fatigue heuristics from wellness (last 2 days)
        fat = conn.execute(text("""
            SELECT w.player_id, p.name,
                   AVG(w.sleep_hours) AS sh,
                   AVG(w.soreness)    AS sr,
                   AVG(w.stress)      AS st
            FROM wellness_logs w
            JOIN players p ON p.id = w.player_id
            WHERE w.log_date BETWEEN :d1 AND :d2
            GROUP BY w.player_id, p.name
        """), {"d1": today - timedelta(days=2), "d2": today}).mappings().all()

        for r in fat:
            sh = float(r["sh"] or 0.0)
            sr = float(r["sr"] or 0.0)
            st = float(r["st"] or 0.0)
            tired = (sh < 6.0) or (sr >= 7) or (st >= 4)
            if tired:
                sev = "high" if (sh < 5.0) or (sr >= 8) or (st >= 5) else "medium"
                bits = []
                if r["sh"] is not None: bits.append(f"sleep {sh:.1f}h")
                if r["sr"] is not None: bits.append(f"soreness {sr:.0f}/10")
                if r["st"] is not None: bits.append(f"stress {st:.0f}/5")
                desc = f"{r['name']} — " + (", ".join(bits) if bits else "fatigue indicators")
                alerts.append({
                    "id": f"fatigue-{r['player_id']}",
                    "type": "fatigue",
                    "title": "Fatigue Alert",
                    "description": desc,
                    "player": r["name"],
                    "severity": sev,
                })

    return jsonify(alerts)




# ---- run LAST ----
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)