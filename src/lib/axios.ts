import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'

/**
 * 将 snake_case 字符串转换为 camelCase。
 * @param str - 需要转换的字符串
 * @returns 转换后的 camelCase 字符串
 */
const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * 将 camelCase 字符串转换为 snake_case。
 * @param str - 需要转换的字符串
 * @returns 转换后的 snake_case 字符串
 */
const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * 递归转换对象键名。
 * @param obj - 需要转换的对象、数组或基本类型
 * @param transformer - 键名转换函数
 * @returns 转换后的对象
 */
const transformKeys = (obj: any, transformer: (key: string) => string): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeys(item, transformer))
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[transformer(key)] = transformKeys(obj[key], transformer)
      return acc
    }, {} as any)
  }
  return obj
}

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
 * 请求拦截器 - 自动附加 Token 并转换请求数据为 snake_case。
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().auth.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 将请求数据从 camelCase 转换为 snake_case
    if (config.data) {
      config.data = transformKeys(config.data, camelToSnake)
    }
    if (config.params) {
      config.params = transformKeys(config.params, camelToSnake)
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器 - 将响应数据转换为 camelCase 并统一错误处理。
 */
api.interceptors.response.use(
  (response) => {
    // 将响应数据从 snake_case 转换为 camelCase
    if (response.data) {
      response.data = transformKeys(response.data, snakeToCamel)
    }
    return response
  },
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
