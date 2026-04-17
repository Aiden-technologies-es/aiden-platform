const BASE_URL = process.env.TITAN_API_URL ?? 'https://api.titan.email/v1'
const API_KEY  = process.env.TITAN_API_KEY ?? ''

async function titanFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? `Titan error ${res.status}`)
  return data as T
}

// ── Create mailbox ──
export async function createMailbox(params: {
  email: string
  password: string
  firstName?: string
  lastName?: string
  quotaMB?: number
}) {
  return titanFetch<{ accountId: string; email: string }>('/accounts', {
    method: 'POST',
    body: JSON.stringify({
      email:     params.email,
      password:  params.password,
      firstName: params.firstName ?? '',
      lastName:  params.lastName ?? '',
      quota:     (params.quotaMB ?? 5000) * 1024 * 1024, // bytes
    }),
  })
}

// ── Get mailbox info ──
export async function getMailbox(accountId: string) {
  return titanFetch<{ accountId: string; email: string; quota: number; used: number }>(
    `/accounts/${accountId}`
  )
}

// ── Delete mailbox ──
export async function deleteMailbox(accountId: string) {
  return titanFetch<void>(`/accounts/${accountId}`, { method: 'DELETE' })
}

// ── Reset password ──
export async function resetMailboxPassword(accountId: string, newPassword: string) {
  return titanFetch<void>(`/accounts/${accountId}/password`, {
    method: 'PUT',
    body: JSON.stringify({ password: newPassword }),
  })
}

// ── Generate webmail SSO token ──
export async function getWebmailToken(accountId: string): Promise<string> {
  const res = await titanFetch<{ token: string; webmailUrl: string }>(
    `/accounts/${accountId}/sso-token`,
    { method: 'POST' }
  )
  return res.webmailUrl
}

// ── List mailboxes for a domain ──
export async function listMailboxes(domain: string) {
  return titanFetch<{ accounts: Array<{ accountId: string; email: string; status: string }> }>(
    `/domains/${domain}/accounts`
  )
}
