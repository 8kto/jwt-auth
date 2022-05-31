import axios from 'axios'
import AuthResponse from "../models/response/AuthResponse";

export const API_URL = 'http://localhost:5000/api'

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL
})

$api.interceptors.request.use(config => {
  // @ts-ignore
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`

  return config
})

$api.interceptors.response.use(
  config => config,
  async error => {
    const originalRequest = error.config

    if (error.response.status == 401 && !originalRequest._isRetry) {
      try {
        originalRequest._isRetry = true
        const res = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true
        })

        localStorage.setItem('token', res.data.accessToken)

        return $api.request(originalRequest)
      } catch (e) {
        console.log('Not authorized')
      }
    }

    throw error
  })

export default $api