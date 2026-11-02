// Cloudflare Pages Function: /api/sync/:key
// Handles secure, serverless multi-device synchronization backed by Cloudflare D1

interface Env {
  DB: D1Database
}

interface VaultRecord {
  sync_key: string
  payload: string
  updated_at: number
  created_at: number
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// OPTIONS: CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

let tableEnsured = false

async function ensureVaultsTable(db: D1Database): Promise<void> {
  if (tableEnsured) return
  try {
    await db.prepare(
      `CREATE TABLE IF NOT EXISTS vaults (
        sync_key TEXT PRIMARY KEY,
        payload TEXT NOT NULL,
        updated_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      )`
    ).run()
    tableEnsured = true
  } catch (err) {
    console.warn('Auto table create error:', err)
  }
}

// GET /api/sync/:key - Retrieve stored vault
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { params, env } = context
  const key = params.key as string

  if (!isValidSyncKey(key)) {
    return new Response(JSON.stringify({ error: 'Invalid sync key format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }

  if (!env.DB) {
    return new Response(
      JSON.stringify({ error: 'Cloudflare D1 binding DB is not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    )
  }

  try {
    await ensureVaultsTable(env.DB)
    const row = await env.DB.prepare(
      'SELECT payload, updated_at FROM vaults WHERE sync_key = ?'
    )
      .bind(key)
      .first<Pick<VaultRecord, 'payload' | 'updated_at'>>()

    if (!row) {
      return new Response(JSON.stringify({ error: 'Vault not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      })
    }

    return new Response(
      JSON.stringify({
        payload: JSON.parse(row.payload),
        updatedAt: row.updated_at,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Database query error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }
}

// POST /api/sync/:key - Upload and synchronize vault
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { params, request, env } = context
  const key = params.key as string

  if (!isValidSyncKey(key)) {
    return new Response(JSON.stringify({ error: 'Invalid sync key format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }

  if (!env.DB) {
    return new Response(
      JSON.stringify({ error: 'Cloudflare D1 binding DB is not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    )
  }

  try {
    await ensureVaultsTable(env.DB)
    const bodyText = await request.text()
    if (bodyText.length > 512 * 1024) {
      // 512 KB payload size limit
      return new Response(JSON.stringify({ error: 'Payload exceeds 512KB limit' }), {
        status: 413,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      })
    }

    const { payload, updatedAt } = JSON.parse(bodyText)
    if (!payload || typeof updatedAt !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Invalid payload or missing updatedAt timestamp' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      )
    }

    // Check existing vault for Last-Write-Wins conflict resolution
    const existing = await env.DB.prepare(
      'SELECT payload, updated_at FROM vaults WHERE sync_key = ?'
    )
      .bind(key)
      .first<Pick<VaultRecord, 'payload' | 'updated_at'>>()

    if (existing && existing.updated_at > updatedAt) {
      // Conflict: Remote database is strictly newer than the incoming payload
      return new Response(
        JSON.stringify({
          error: 'Remote version is newer',
          conflict: true,
          payload: JSON.parse(existing.payload),
          updatedAt: existing.updated_at,
        }),
        { status: 409, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      )
    }

    const now = Date.now()
    const payloadJsonString = JSON.stringify(payload)

    await env.DB.prepare(
      `INSERT INTO vaults (sync_key, payload, updated_at, created_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(sync_key) DO UPDATE SET
         payload = excluded.payload,
         updated_at = excluded.updated_at`
    )
      .bind(key, payloadJsonString, updatedAt, now)
      .run()

    return new Response(
      JSON.stringify({
        success: true,
        updatedAt,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Database write error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }
}

// DELETE /api/sync/:key - Remove vault
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { params, env } = context
  const key = params.key as string

  if (!isValidSyncKey(key) || !env.DB) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }

  try {
    await env.DB.prepare('DELETE FROM vaults WHERE sync_key = ?').bind(key).run()
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Deletion error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }
}

function isValidSyncKey(key: string): boolean {
  // Sync keys must be 10 to 64 alphanumeric characters, underscores, or hyphens
  return typeof key === 'string' && /^[a-zA-Z0-9_-]{10,64}$/.test(key)
}
