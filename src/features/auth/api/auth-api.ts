import { api } from '@/lib/axios'
import type { LoginRequest, LoginResponse, RegisterRequest, UserResponse } from '@/types/auth'

/**
 * 用户登录。
 *
 * @param data - 登录请求参数
 * @returns 登录响应数据，包含用户信息和访问令牌
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<{ data: LoginResponse }>('/api/auth/login', data)
  return response.data.data
}

/**
 * 用户注册。
 *
 * @param data - 注册请求参数
 * @returns 注册响应数据，包含用户信息和访问令牌
 */
export async function register(data: RegisterRequest): Promise<LoginResponse> {
  const response = await api.post<{ data: LoginResponse }>('/api/auth/register', data)
  return response.data.data
}

/**
 * 获取当前用户信息。
 *
 * @returns 当前用户信息
 */
export async function getCurrentUser(): Promise<UserResponse> {
  const response = await api.get<{ data: UserResponse }>('/api/auth/me')
  return response.data.data
}

/**
 * 用户登出。
 */
export async function logout(): Promise<void> {
  await api.post('/api/auth/logout')
}
