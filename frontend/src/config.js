// Central place for all runtime configuration pulled from environment
// variables (see .env / .env.example). Import from here — never read
// import.meta.env directly in feature code.

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/'
export const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`
