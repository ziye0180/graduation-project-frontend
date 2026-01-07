import { api } from '@/lib/axios'
import { MOCK_ENABLED } from '@/mocks'
import {
  mockGetProjectList,
  mockGetProjectById,
  mockCreateProject,
  mockUpdateProject,
  mockDeleteProject,
  mockGetMyProjects,
  mockGetProjectMembers,
  mockAddProjectMember,
  mockRemoveProjectMember,
  mockUpdateMemberRole,
  mockGetProjectLiterature,
  mockAddProjectLiterature,
  mockRemoveProjectLiterature,
} from '@/mocks/handlers/project-handlers'
import { useAuthStore } from '@/stores/auth-store'
import type { Project, ProjectRequest, ProjectMember, AddMemberRequest, PageResponse } from '@/types/project'
import type { Literature } from '@/types/literature'

/**
 * 分页查询项目列表。
 *
 * @param params - 查询参数
 * @param params.page - 页码，默认 1
 * @param params.size - 每页数量，默认 10
 * @param params.name - 项目名称关键词，可选
 * @param params.status - 项目状态，可选
 * @returns 分页项目列表
 */
export async function getProjectList(params: {
  page?: number
  size?: number
  name?: string
  status?: number
}): Promise<PageResponse<Project>> {
  if (MOCK_ENABLED) {
    return mockGetProjectList({
      pageNum: params.page,
      pageSize: params.size,
      keyword: params.name,
      status: params.status,
    })
  }
  const response = await api.get<{ data: PageResponse<Project> }>('/api/projects', {
    params: {
      page: params.page || 1,
      size: params.size || 10,
      name: params.name,
      status: params.status,
    },
  })
  return response.data.data
}

/**
 * 获取项目详情。
 *
 * @param id - 项目 ID
 * @returns 项目详情
 */
export async function getProjectById(id: number): Promise<Project> {
  if (MOCK_ENABLED) {
    return mockGetProjectById(id)
  }
  const response = await api.get<{ data: Project }>(`/api/projects/${id}`)
  return response.data.data
}

/**
 * 创建项目。
 *
 * @param data - 项目数据
 * @returns 创建的项目
 */
export async function createProject(data: ProjectRequest): Promise<Project> {
  if (MOCK_ENABLED) {
    const userId = useAuthStore.getState().auth.user?.id || 1
    return mockCreateProject(data, userId)
  }
  const response = await api.post<{ data: Project }>('/api/projects', data)
  return response.data.data
}

/**
 * 更新项目。
 *
 * @param id - 项目 ID
 * @param data - 更新的项目数据
 * @returns 更新后的项目
 */
export async function updateProject(id: number, data: ProjectRequest): Promise<Project> {
  if (MOCK_ENABLED) {
    return mockUpdateProject(id, data)
  }
  const response = await api.put<{ data: Project }>(`/api/projects/${id}`, data)
  return response.data.data
}

/**
 * 删除项目。
 *
 * @param id - 项目 ID
 */
export async function deleteProject(id: number): Promise<void> {
  if (MOCK_ENABLED) {
    return mockDeleteProject(id)
  }
  await api.delete(`/api/projects/${id}`)
}

/**
 * 获取我的项目列表。
 *
 * @returns 我的项目列表
 */
export async function getMyProjects(): Promise<Project[]> {
  if (MOCK_ENABLED) {
    const userId = useAuthStore.getState().auth.user?.id || 1
    return mockGetMyProjects(userId)
  }
  const response = await api.get<{ data: Project[] }>('/api/projects/my')
  return response.data.data
}

// ==================== 成员管理 ====================

/**
 * 获取项目成员列表。
 *
 * @param projectId - 项目 ID
 * @returns 项目成员列表
 */
export async function getProjectMembers(projectId: number): Promise<ProjectMember[]> {
  if (MOCK_ENABLED) {
    return mockGetProjectMembers(projectId)
  }
  const response = await api.get<{ data: ProjectMember[] }>(`/api/projects/${projectId}/members`)
  return response.data.data
}

/**
 * 添加项目成员。
 *
 * @param projectId - 项目 ID
 * @param data - 成员数据
 * @returns 添加的成员信息
 */
export async function addProjectMember(projectId: number, data: AddMemberRequest): Promise<ProjectMember> {
  if (MOCK_ENABLED) {
    return mockAddProjectMember(projectId, data)
  }
  const response = await api.post<{ data: ProjectMember }>(`/api/projects/${projectId}/members`, data)
  return response.data.data
}

/**
 * 移除项目成员。
 *
 * @param projectId - 项目 ID
 * @param userId - 用户 ID
 */
export async function removeProjectMember(projectId: number, userId: number): Promise<void> {
  if (MOCK_ENABLED) {
    return mockRemoveProjectMember(projectId, userId)
  }
  await api.delete(`/api/projects/${projectId}/members/${userId}`)
}

/**
 * 更新成员角色。
 *
 * @param projectId - 项目 ID
 * @param userId - 用户 ID
 * @param role - 新角色
 * @returns 更新后的成员信息
 */
export async function updateMemberRole(projectId: number, userId: number, role: number): Promise<ProjectMember> {
  if (MOCK_ENABLED) {
    return mockUpdateMemberRole(projectId, userId, role)
  }
  const response = await api.put<{ data: ProjectMember }>(`/api/projects/${projectId}/members/${userId}/role?role=${role}`)
  return response.data.data
}

// ==================== 文献关联 ====================

/**
 * 获取项目关联的文献列表。
 *
 * @param projectId - 项目 ID
 * @returns 文献列表
 */
export async function getProjectLiterature(projectId: number): Promise<Literature[]> {
  if (MOCK_ENABLED) {
    return mockGetProjectLiterature(projectId)
  }
  const response = await api.get<{ data: Literature[] }>(`/api/projects/${projectId}/literature`)
  return response.data.data
}

/**
 * 批量关联文献到项目。
 *
 * @param projectId - 项目 ID
 * @param literatureIds - 文献 ID 列表
 */
export async function addProjectLiterature(projectId: number, literatureIds: number[]): Promise<void> {
  if (MOCK_ENABLED) {
    const userId = useAuthStore.getState().auth.user?.id || 1
    return mockAddProjectLiterature(projectId, literatureIds, userId)
  }
  await api.post(`/api/projects/${projectId}/literature`, literatureIds)
}

/**
 * 取消文献与项目的关联。
 *
 * @param projectId - 项目 ID
 * @param literatureId - 文献 ID
 */
export async function removeProjectLiterature(projectId: number, literatureId: number): Promise<void> {
  if (MOCK_ENABLED) {
    return mockRemoveProjectLiterature(projectId, literatureId)
  }
  await api.delete(`/api/projects/${projectId}/literature/${literatureId}`)
}
