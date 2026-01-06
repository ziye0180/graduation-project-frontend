/**
 * 项目信息。
 */
export interface Project {
  id: number
  name: string
  description: string | null
  status: number
  statusDescription: string
  ownerId: number
  ownerName: string
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
}

/**
 * 项目请求参数。
 */
export interface ProjectRequest {
  name: string
  description?: string
  status: number
  startDate?: string
  endDate?: string
}

/**
 * 项目成员信息。
 */
export interface ProjectMember {
  id: number
  projectId: number
  userId: number
  username: string
  nickname: string | null
  avatar: string | null
  role: number
  roleName: string
  joinedAt: string
}

/**
 * 添加成员请求参数。
 */
export interface AddMemberRequest {
  userId: number
  role: number
}

/**
 * 分页响应。
 */
export interface PageResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}
