import type { Project, ProjectRequest, ProjectMember, AddMemberRequest, PageResponse } from '@/types/project'
import type { Literature } from '@/types/literature'
import { mockProjects, getNextProjectId, PROJECT_STATUS_MAP } from '../data/projects'
import {
  mockProjectMembers,
  getProjectMembersByProjectId,
  getNextMemberId,
  getUserById,
  MEMBER_ROLE_MAP,
} from '../data/project-members'
import {
  mockProjectLiterature,
  getProjectLiteratureList,
  getNextRelationId,
} from '../data/project-literature'
import { mockUsers } from '../data/users'

/**
 * 模拟网络延迟。
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 可变的项目数据（用于 CRUD 操作）。
 */
let projectData = [...mockProjects]
let memberData = [...mockProjectMembers]
let literatureRelationData = [...mockProjectLiterature]

/**
 * 重置项目数据（测试用）。
 */
export function resetProjectData() {
  projectData = [...mockProjects]
  memberData = [...mockProjectMembers]
  literatureRelationData = [...mockProjectLiterature]
}

/**
 * Mock 获取项目列表（分页 + 搜索）。
 */
export async function mockGetProjectList(params: {
  pageNum?: number
  pageSize?: number
  keyword?: string
  status?: number
}): Promise<PageResponse<Project>> {
  await delay(300)

  let filtered = [...projectData]

  // 状态筛选
  if (params.status !== undefined) {
    filtered = filtered.filter((p) => p.status === params.status)
  }

  // 关键词搜索（项目名称、描述、负责人）
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.description?.toLowerCase().includes(keyword) ||
        p.ownerName.toLowerCase().includes(keyword)
    )
  }

  // 分页
  const pageNum = params.pageNum || 1
  const pageSize = params.pageSize || 10
  const start = (pageNum - 1) * pageSize
  const records = filtered.slice(start, start + pageSize)

  return {
    records,
    total: filtered.length,
    size: pageSize,
    current: pageNum,
    pages: Math.ceil(filtered.length / pageSize),
  }
}

/**
 * Mock 获取项目详情。
 */
export async function mockGetProjectById(id: number): Promise<Project> {
  await delay(200)

  const project = projectData.find((p) => p.id === id)

  if (!project) {
    throw new Error('项目不存在')
  }

  return project
}

/**
 * Mock 创建项目。
 */
export async function mockCreateProject(
  data: ProjectRequest,
  ownerId: number = 1
): Promise<Project> {
  await delay(500)

  const owner = mockUsers.find((u) => u.id === ownerId)

  const newProject: Project = {
    id: getNextProjectId(),
    name: data.name,
    description: data.description || null,
    status: data.status,
    statusDescription: PROJECT_STATUS_MAP[data.status] || '未知',
    ownerId,
    ownerName: owner?.nickname || owner?.username || '',
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  projectData.push(newProject)

  // 自动添加创建者为负责人
  const ownerMember: ProjectMember = {
    id: getNextMemberId(),
    projectId: newProject.id,
    userId: ownerId,
    username: owner?.username || '',
    nickname: owner?.nickname || null,
    avatar: owner?.avatar || null,
    role: 0,
    roleName: '负责人',
    joinedAt: new Date().toISOString(),
  }
  memberData.push(ownerMember)

  return newProject
}

/**
 * Mock 更新项目。
 */
export async function mockUpdateProject(id: number, data: ProjectRequest): Promise<Project> {
  await delay(500)

  const index = projectData.findIndex((p) => p.id === id)

  if (index === -1) {
    throw new Error('项目不存在')
  }

  const updated: Project = {
    ...projectData[index],
    name: data.name,
    description: data.description || null,
    status: data.status,
    statusDescription: PROJECT_STATUS_MAP[data.status] || '未知',
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    updatedAt: new Date().toISOString(),
  }

  projectData[index] = updated
  return updated
}

/**
 * Mock 删除项目。
 */
export async function mockDeleteProject(id: number): Promise<void> {
  await delay(300)

  const index = projectData.findIndex((p) => p.id === id)

  if (index === -1) {
    throw new Error('项目不存在')
  }

  // 删除项目
  projectData.splice(index, 1)

  // 删除相关成员
  memberData = memberData.filter((m) => m.projectId !== id)

  // 删除相关文献关联
  literatureRelationData = literatureRelationData.filter((r) => r.projectId !== id)
}

/**
 * Mock 获取我的项目列表。
 */
export async function mockGetMyProjects(userId: number): Promise<Project[]> {
  await delay(200)

  // 获取用户参与的项目 ID
  const myProjectIds = memberData
    .filter((m) => m.userId === userId)
    .map((m) => m.projectId)

  return projectData.filter((p) => myProjectIds.includes(p.id))
}

// ==================== 成员管理 ====================

/**
 * Mock 获取项目成员列表。
 */
export async function mockGetProjectMembers(projectId: number): Promise<ProjectMember[]> {
  await delay(200)
  return memberData.filter((m) => m.projectId === projectId)
}

/**
 * Mock 添加项目成员。
 */
export async function mockAddProjectMember(
  projectId: number,
  data: AddMemberRequest
): Promise<ProjectMember> {
  await delay(500)

  // 检查项目是否存在
  const project = projectData.find((p) => p.id === projectId)
  if (!project) {
    throw new Error('项目不存在')
  }

  // 检查用户是否存在
  const user = getUserById(data.userId)
  if (!user) {
    throw new Error('用户不存在')
  }

  // 检查是否已是成员
  const existing = memberData.find(
    (m) => m.projectId === projectId && m.userId === data.userId
  )
  if (existing) {
    throw new Error('该用户已是项目成员')
  }

  const newMember: ProjectMember = {
    id: getNextMemberId(),
    projectId,
    userId: data.userId,
    username: user.username,
    nickname: user.nickname,
    avatar: user.avatar,
    role: data.role,
    roleName: MEMBER_ROLE_MAP[data.role] || '成员',
    joinedAt: new Date().toISOString(),
  }

  memberData.push(newMember)
  return newMember
}

/**
 * Mock 移除项目成员。
 */
export async function mockRemoveProjectMember(
  projectId: number,
  userId: number
): Promise<void> {
  await delay(300)

  const index = memberData.findIndex(
    (m) => m.projectId === projectId && m.userId === userId
  )

  if (index === -1) {
    throw new Error('成员不存在')
  }

  // 不能移除负责人
  if (memberData[index].role === 0) {
    throw new Error('不能移除项目负责人')
  }

  memberData.splice(index, 1)
}

/**
 * Mock 更新成员角色。
 */
export async function mockUpdateMemberRole(
  projectId: number,
  userId: number,
  role: number
): Promise<ProjectMember> {
  await delay(300)

  const member = memberData.find(
    (m) => m.projectId === projectId && m.userId === userId
  )

  if (!member) {
    throw new Error('成员不存在')
  }

  // 不能修改负责人角色
  if (member.role === 0) {
    throw new Error('不能修改项目负责人角色')
  }

  member.role = role
  member.roleName = MEMBER_ROLE_MAP[role] || '成员'

  return member
}

// ==================== 文献关联 ====================

/**
 * Mock 获取项目文献列表。
 */
export async function mockGetProjectLiterature(projectId: number): Promise<Literature[]> {
  await delay(200)
  return getProjectLiteratureList(projectId)
}

/**
 * Mock 批量关联文献到项目。
 */
export async function mockAddProjectLiterature(
  projectId: number,
  literatureIds: number[],
  addedBy: number = 1
): Promise<void> {
  await delay(500)

  // 检查项目是否存在
  const project = projectData.find((p) => p.id === projectId)
  if (!project) {
    throw new Error('项目不存在')
  }

  // 添加关联
  for (const literatureId of literatureIds) {
    // 检查是否已关联
    const existing = literatureRelationData.find(
      (r) => r.projectId === projectId && r.literatureId === literatureId
    )
    if (!existing) {
      literatureRelationData.push({
        id: getNextRelationId(),
        projectId,
        literatureId,
        addedBy,
        addedAt: new Date().toISOString(),
      })
    }
  }
}

/**
 * Mock 取消文献关联。
 */
export async function mockRemoveProjectLiterature(
  projectId: number,
  literatureId: number
): Promise<void> {
  await delay(300)

  const index = literatureRelationData.findIndex(
    (r) => r.projectId === projectId && r.literatureId === literatureId
  )

  if (index === -1) {
    throw new Error('关联不存在')
  }

  literatureRelationData.splice(index, 1)
}
