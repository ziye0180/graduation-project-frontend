import type { LoginRequest, LoginResponse, RegisterRequest, UserResponse } from '@/types/auth'
import { mockUsers, findUserByEmail, type MockUser } from '../data/users'

/**
 * 模拟网络延迟。
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 将 MockUser 转换为 UserResponse。
 */
function toUserResponse(user: MockUser): UserResponse {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    nickname: user.nickname,
    avatar: user.avatar,
    status: user.status,
    statusDescription: user.status === 1 ? '正常' : '禁用',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Mock 登录处理。
 */
export async function mockLogin(data: LoginRequest): Promise<LoginResponse> {
  await delay(500)

  const user = findUserByEmail(data.email)

  if (!user) {
    throw new Error('邮箱或密码错误')
  }

  if (user.password !== data.password) {
    throw new Error('邮箱或密码错误')
  }

  if (user.status === 0) {
    throw new Error('账户已被禁用')
  }

  return {
    accessToken: `mock-token-${user.id}-${Date.now()}`,
    tokenType: 'Bearer',
    expiresIn: 86400,
    user: toUserResponse(user),
  }
}

/**
 * Mock 注册处理。
 */
export async function mockRegister(data: RegisterRequest): Promise<LoginResponse> {
  await delay(500)

  // 检查邮箱是否已存在
  if (mockUsers.some((u) => u.email === data.email)) {
    throw new Error('邮箱已被注册')
  }

  // 检查用户名是否已存在
  if (mockUsers.some((u) => u.username === data.username)) {
    throw new Error('用户名已被使用')
  }

  // 模拟创建新用户
  const newUser: MockUser = {
    id: mockUsers.length + 1,
    username: data.username,
    email: data.email,
    password: data.password,
    nickname: data.nickname || null,
    avatar: null,
    status: 1,
  }

  // 添加到 mock 数据中
  mockUsers.push(newUser)

  return {
    accessToken: `mock-token-${newUser.id}-${Date.now()}`,
    tokenType: 'Bearer',
    expiresIn: 86400,
    user: toUserResponse(newUser),
  }
}

/**
 * Mock 获取当前用户信息。
 */
export async function mockGetCurrentUser(userId: number): Promise<UserResponse> {
  await delay(200)

  const user = mockUsers.find((u) => u.id === userId)

  if (!user) {
    throw new Error('用户不存在')
  }

  return toUserResponse(user)
}

/**
 * Mock 登出处理。
 */
export async function mockLogout(): Promise<void> {
  await delay(200)
  // 登出只需要清除前端 token，无需后端操作
}

/**
 * Mock 修改密码处理。
 */
export async function mockChangePassword(data: {
  oldPassword: string
  newPassword: string
  userId: number
}): Promise<void> {
  await delay(500)

  const user = mockUsers.find((u) => u.id === data.userId)

  if (!user) {
    throw new Error('用户不存在')
  }

  if (user.password !== data.oldPassword) {
    throw new Error('原密码错误')
  }

  // 更新密码
  user.password = data.newPassword
}
