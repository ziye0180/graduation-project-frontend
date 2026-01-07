import type { AuthUser } from '@/types/auth'

/**
 * Mock 用户数据（包含密码用于登录验证）。
 */
export interface MockUser extends AuthUser {
  password: string
}

/**
 * 用户 Mock 数据（来自 mock-data.sql）。
 * 共 8 个用户，密码统一为 123456。
 */
export const mockUsers: MockUser[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: '123456',
    nickname: '系统管理员',
    avatar: null,
    status: 1,
  },
  {
    id: 2,
    username: 'lihan',
    email: 'lihan@example.com',
    password: '123456',
    nickname: '李函',
    avatar: null,
    status: 1,
  },
  {
    id: 3,
    username: 'zhangsan',
    email: 'zhangsan@example.com',
    password: '123456',
    nickname: '张三',
    avatar: null,
    status: 1,
  },
  {
    id: 4,
    username: 'lisi',
    email: 'lisi@example.com',
    password: '123456',
    nickname: '李四',
    avatar: null,
    status: 1,
  },
  {
    id: 5,
    username: 'wangwu',
    email: 'wangwu@example.com',
    password: '123456',
    nickname: '王五',
    avatar: null,
    status: 1,
  },
  {
    id: 6,
    username: 'zhaoliu',
    email: 'zhaoliu@example.com',
    password: '123456',
    nickname: '赵六',
    avatar: null,
    status: 1,
  },
  {
    id: 7,
    username: 'sunqi',
    email: 'sunqi@example.com',
    password: '123456',
    nickname: '孙七',
    avatar: null,
    status: 0, // 禁用状态
  },
  {
    id: 8,
    username: 'zhouban',
    email: 'zhouban@example.com',
    password: '123456',
    nickname: '周八',
    avatar: null,
    status: 1,
  },
]

/**
 * 根据邮箱查找用户。
 */
export function findUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find((u) => u.email === email)
}

/**
 * 根据ID查找用户。
 */
export function findUserById(id: number): MockUser | undefined {
  return mockUsers.find((u) => u.id === id)
}
