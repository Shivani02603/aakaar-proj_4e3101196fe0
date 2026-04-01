CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    content TEXT
);

CREATE INDEX IF NOT EXISTS idx_notes_title ON notes(title);