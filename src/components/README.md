## python -m app.api( cd backend)
## npm run dev

source .venv/bin/activate
conda deactivate


-- -- Wipe the table and reset the auto-increment to 1
-- TRUNCATE TABLE wellness_logs RESTART IDENTITY;