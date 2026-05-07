import axios from 'axios'
import { getSessionToken } from '@tiendanube/nexo'
import { nexo } from './nexo'

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3400'
const BYPASS_NEXO = import.meta.env.VITE_BYPASS_NEXO === 'true'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use(async (config) => {
  if (BYPASS_NEXO) {
    return config
  }

  try {
    const token = await getSessionToken(nexo)
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (error) {
    console.warn('Failed to fetch Nexo session token', error)
  }

  return config
})
