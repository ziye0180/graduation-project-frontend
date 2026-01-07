import { api } from '@/lib/axios'
import { MOCK_ENABLED } from '@/mocks'
import {
  mockLogin,
  mockRegister,
  mockGetCurrentUser,
  mockLogout,
  mockChangePassword,
} from '@/mocks/handlers/auth-handlers'
import type { LoginRequest, LoginResponse, RegisterRequest, UserResponse } from '@/types/auth'
import { useAuthStore } from '@/stores/auth-store'

/**
 * 用户登录。
 *
 * @param data - 登录请求参数
 * @returns 登录响应数据，包含用户信息和访问令牌
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  if (MOCK_ENABLED) {
    return mockLogin(data)
  }
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
  if (MOCK_ENABLED) {
    return mockRegister(data)
  }
  const response = await api.post<{ data: LoginResponse }>('/api/auth/register', data)
  return response.data.data
}

/**
 * 获取当前用户信息。
 *
 * @returns 当前用户信息
 */
export async function getCurrentUser(): Promise<UserResponse> {
  if (MOCK_ENABLED) {
    const userId = useAuthStore.getState().auth.user?.id
    if (!userId) {
      throw new Error('用户未登录')
    }
    return mockGetCurrentUser(userId)
  }
  const response = await api.get<{ data: UserResponse }>('/api/auth/me')
  return response.data.data
}

/**
 * 用户登出。
 */
export async function logout(): Promise<void> {
  if (MOCK_ENABLED) {
    return mockLogout()
  }
  await api.post('/api/auth/logout')
}

/**
 * 修改密码。
 *
 * @param data - 修改密码参数
 * @param data.oldPassword - 原密码
 * @param data.newPassword - 新密码
 */
export async function changePassword(data: {
  oldPassword: string
  newPassword: string
}): Promise<void> {
  if (MOCK_ENABLED) {
    const userId = useAuthStore.getState().auth.user?.id
    if (!userId) {
      throw new Error('用户未登录')
    }
    return mockChangePassword({ ...data, userId })
  }
  await api.post('/api/auth/change-password', data)
}
