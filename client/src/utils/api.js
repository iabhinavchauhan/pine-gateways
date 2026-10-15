const configuredApiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
const API_BASE_URL = configuredApiBase || (import.meta.env.DEV ? '/api' : '')

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('The API URL is not configured. Set VITE_API_URL to the deployed backend /api URL.')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(result.error || `Request failed with status ${response.status}.`)
  }
  return result
}
