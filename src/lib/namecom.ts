const BASE_URL = process.env.NAMECOM_API_URL ?? 'https://api.name.com/v4'
const USERNAME  = process.env.NAMECOM_USERNAME ?? ''
const TOKEN     = process.env.NAMECOM_TOKEN ?? ''

function authHeader(): HeadersInit {
  const encoded = Buffer.from(`${USERNAME}:${TOKEN}`).toString('base64')
  return {
    Authorization: `Basic ${encoded}`,
    'Content-Type': 'application/json',
  }
}

async function namecomFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...authHeader(), ...options?.headers },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? `Name.com error ${res.status}`)
  return data as T
}

// ── Domain search ──
export async function searchDomain(domain: string) {
  return namecomFetch<{
    results: Array<{ domainName: string; purchasable: boolean; purchasePrice: number; renewalPrice: number }>
  }>(`/domains:search`, {
    method: 'POST',
    body: JSON.stringify({ keyword: domain, tldFilter: ['com','es','net','org','io'] }),
  })
}

// ── Domain availability check ──
export async function checkAvailability(domainName: string) {
  return namecomFetch<{ results: Array<{ domainName: string; purchasable: boolean; purchasePrice: number }> }>(
    `/domains:checkAvailability`,
    { method: 'POST', body: JSON.stringify({ domainNames: [domainName] }) }
  )
}

// ── Purchase domain ──
export async function purchaseDomain(domainName: string, years = 1) {
  return namecomFetch<{ domain: { domainName: string; expireDate: string } }>(
    `/domains`,
    {
      method: 'POST',
      body: JSON.stringify({
        domain: { domainName },
        purchasePrice: 0, // Name.com fills this
        years,
      }),
    }
  )
}

// ── Get domain info ──
export async function getDomain(domainName: string) {
  return namecomFetch<{ domainName: string; expireDate: string; autorenewEnabled: boolean; nameservers: string[] }>(
    `/domains/${domainName}`
  )
}

// ── List domains ──
export async function listDomains(page = 1) {
  return namecomFetch<{ domains: Array<{ domainName: string; expireDate: string; locked: boolean }> }>(
    `/domains?page=${page}`
  )
}

// ── Set nameservers ──
export async function setNameservers(domainName: string, nameservers: string[]) {
  return namecomFetch<{ nameservers: string[] }>(
    `/domains/${domainName}:setNameservers`,
    { method: 'POST', body: JSON.stringify({ nameservers }) }
  )
}

// ── DNS records ──
export async function getDnsRecords(domainName: string) {
  return namecomFetch<{ records: Array<{ id: number; domainName: string; host: string; type: string; answer: string; ttl: number }> }>(
    `/domains/${domainName}/records`
  )
}

export async function createDnsRecord(domainName: string, record: {
  host: string; type: string; answer: string; ttl?: number
}) {
  return namecomFetch(`/domains/${domainName}/records`, {
    method: 'POST',
    body: JSON.stringify(record),
  })
}

export async function deleteDnsRecord(domainName: string, recordId: number) {
  return namecomFetch(`/domains/${domainName}/records/${recordId}`, {
    method: 'DELETE',
  })
}

// ── Renew domain ──
export async function renewDomain(domainName: string, years = 1) {
  return namecomFetch(`/domains/${domainName}:renew`, {
    method: 'POST',
    body: JSON.stringify({ years }),
  })
}
