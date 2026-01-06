/**
 * 登录请求参数。
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * 注册请求参数。
 */
export interface RegisterRequest {
  username: string
  email: string
  password: string
  nickname?: string
}

/**
 * 登录响应数据。
 */
export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: UserResponse
}

/**
 * 用户信息响应。
 */
export interface UserResponse {
  id: number
  username: string
  email: string
  nickname: string | null
  avatar: string | null
  status: number
  created_at: string
  updated_at: string
}

/**
 * 认证用户信息（前端存储）。
 */
export interface AuthUser {
  id: number
  username: string
  email: string
  nickname: string | null
  avatar: string | null
  status: number
}
