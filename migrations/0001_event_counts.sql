-- Daily click totals (OpenSpec change run-site-on-cloudflare-workers, design D3).
-- No column can hold an IP address, user agent, page address, referrer, identifier or a
-- time finer than the day.
CREATE TABLE event_counts (
  day   TEXT    NOT NULL CHECK (length(day) = 10),      -- UTC date, YYYY-MM-DD
  name  TEXT    NOT NULL CHECK (length(name) <= 40),
  count INTEGER NOT NULL CHECK (count > 0),
  PRIMARY KEY (day, name)
) STRICT;
