import type { ProjectMember } from '@/types/project'
import { mockUsers } from './users'

/**
 * 成员角色枚举。
 */
export const MEMBER_ROLE = {
  OWNER: 0,
  MEMBER: 1,
  ADMIN: 2,
} as const

/**
 * 成员角色描述映射。
 */
export const MEMBER_ROLE_MAP: Record<number, string> = {
  0: '负责人',
  1: '成员',
  2: '管理员',
}

/**
 * 项目成员 Mock 数据（来自 mock-data.sql）。
 * 共 15 条成员关系。
 */
export const mockProjectMembers: ProjectMember[] = [
  // 项目1: 大语言模型研究项目 - 负责人 lihan
  {
    id: 1,
    projectId: 1,
    userId: 2,
    username: 'lihan',
    nickname: '李函',
    avatar: null,
    role: 0,
    roleName: '负责人',
    joinedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    projectId: 1,
    userId: 3,
    username: 'zhangsan',
    nickname: '张三',
    avatar: null,
    role: 1,
    roleName: '成员',
    joinedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    projectId: 1,
    userId: 4,
    username: 'lisi',
    nickname: '李四',
    avatar: null,
    role: 1,
    roleName: '成员',
    joinedAt: '2025-01-01T00:00:00.000Z',
  },
  // 项目2: 计算机视觉算法优化 - 负责人 zhangsan
  {
    id: 4,
    projectId: 2,
    userId: 3,
    username: 'zhangsan',
    nickname: '张三',
    avatar: null,
    role: 0,
    roleName: '负责人',
    joinedAt: '2025-01-02T00:00:00.000Z',
  },
  {
    id: 5,
    projectId: 2,
    userId: 5,
    username: 'wangwu',
    nickname: '王五',
    avatar: null,
    role: 1,
    roleName: '成员',
    joinedAt: '2025-01-02T00:00:00.000Z',
  },
  {
    id: 6,
    projectId: 2,
    userId: 6,
    username: 'zhaoliu',
    nickname: '赵六',
    avatar: null,
    role: 1,
    roleName: '成员',
    joinedAt: '2025-01-02T00:00:00.000Z',
  },
  // 项目3: 分布式存储系统设计 - 负责人 lisi
  {
    id: 7,
    projectId: 3,
    userId: 4,
    username: 'lisi',
    nickname: '李四',
    avatar: null,
    role: 0,
    roleName: '负责人',
    joinedAt: '2025-01-03T00:00:00.000Z',
  },
  {
    id: 8,
    projectId: 3,
    userId: 2,
    username: 'lihan',
    nickname: '李函',
    avatar: null,
    role: 1,
    roleName: '成员',
    joinedAt: '2025-01-03T00:00:00.000Z',
  },
  {
    id: 9,
    projectId: 3,
    userId: 8,
    username: 'zhouban',
    nickname: '周八',
    avatar: null,
    role: 1,
    roleName: '成员',
    joinedAt: '2025-01-03T00:00:00.000Z',
  },
  // 项目4: 智能问答系统开发 - 负责人 wangwu
  {
    id: 10,
    projectId: 4,
    userId: 5,
    username: 'wangwu',
    nickname: '王五',
    avatar: null,
    role: 0,
    roleName: '负责人',
    joinedAt: '2025-01-04T00:00:00.000Z',
  },
  {
    id: 11,
    projectId: 4,
    userId: 2,
    username: 'lihan',
    nickname: '李函',
    avatar: null,
    role: 1,
    roleName: '成员',
    joinedAt: '2025-01-04T00:00:00.000Z',
  },
  // 项目5: 代码质量分析工具 - 负责人 lihan
  {
    id: 12,
    projectId: 5,
    userId: 2,
    username: 'lihan',
    nickname: '李函',
    avatar: null,
    role: 0,
    roleName: '负责人',
    joinedAt: '2025-01-05T00:00:00.000Z',
  },
  {
    id: 13,
    projectId: 5,
    userId: 6,
    username: 'zhaoliu',
    nickname: '赵六',
    avatar: null,
    role: 1,
    roleName: '成员',
    joinedAt: '2025-01-05T00:00:00.000Z',
  },
  // 项目6: 深度学习框架比较研究 - 负责人 zhaoliu
  {
    id: 14,
    projectId: 6,
    userId: 6,
    username: 'zhaoliu',
    nickname: '赵六',
    avatar: null,
    role: 0,
    roleName: '负责人',
    joinedAt: '2025-01-06T00:00:00.000Z',
  },
  {
    id: 15,
    projectId: 6,
    userId: 3,
    username: 'zhangsan',
    nickname: '张三',
    avatar: null,
    role: 1,
    roleName: '成员',
    joinedAt: '2025-01-06T00:00:00.000Z',
  },
]

/**
 * 获取项目成员列表。
 */
export function getProjectMembersByProjectId(projectId: number): ProjectMember[] {
  return mockProjectMembers.filter((m) => m.projectId === projectId)
}

/**
 * 检查用户是否为项目成员。
 */
export function isProjectMember(projectId: number, userId: number): boolean {
  return mockProjectMembers.some((m) => m.projectId === projectId && m.userId === userId)
}

/**
 * 获取下一个成员 ID。
 */
export function getNextMemberId(): number {
  return Math.max(...mockProjectMembers.map((m) => m.id)) + 1
}

/**
 * 根据用户 ID 获取用户信息。
 */
export function getUserById(userId: number) {
  return mockUsers.find((u) => u.id === userId)
}
