import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'

/**
 * API 响应基础结构。
 */
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/**
 * 创建 Axios 实例。
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:20003',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 请求拦截器 - 自动附加 Token。
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().auth.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器 - 统一错误处理。
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    const { response } = error

    if (response) {
      const { status, data } = response

      switch (status) {
        case 401:
          useAuthStore.getState().auth.reset()
          toast.error('登录已过期，请重新登录')
          window.location.href = '/sign-in'
          break
        case 403:
          toast.error('没有权限访问该资源')
          break
        case 404:
          toast.error('请求的资源不存在')
          break
        case 500:
          toast.error(data?.message || '服务器内部错误')
          break
        default:
          toast.error(data?.message || '请求失败')
      }
    } else if (error.request) {
      toast.error('网络连接失败，请检查网络')
    } else {
      toast.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

export { api }
export type { ApiResponse }
