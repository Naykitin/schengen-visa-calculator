-- Migration 0001: Initial schema for Cloudflare D1 multi-device sync
CREATE TABLE IF NOT EXISTS vaults (
    sync_key TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    updated_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vaults_updated ON vaults(updated_at);
