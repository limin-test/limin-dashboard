const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!configuredApiBaseUrl?.trim()) {
  throw new Error('VITE_API_BASE_URL wajib diatur. Salin .env.example menjadi .env terlebih dahulu.')
}

export const apiBaseUrl = configuredApiBaseUrl.replace(/\/+$/, '')
