CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  work_minutes INTEGER NOT NULL,
  break_minutes INTEGER NOT NULL,
  started_at TEXT NOT NULL,
  ended_at TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS daily_reports (
  date TEXT PRIMARY KEY,
  total_sessions INTEGER NOT NULL,
  total_work_minutes INTEGER NOT NULL,
  total_break_minutes INTEGER NOT NULL,
  generated_at TEXT NOT NULL
);
