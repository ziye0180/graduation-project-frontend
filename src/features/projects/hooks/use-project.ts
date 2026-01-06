import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getProjectList,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getMyProjects,
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
  updateMemberRole,
  getProjectLiterature,
  addProjectLiterature,
  removeProjectLiterature,
} from '../api/project-api'
import type { Project, ProjectRequest, ProjectMember, AddMemberRequest, PageResponse } from '@/types/project'
import type { Literature } from '@/types/literature'

/**
 * 查询键常量。
 */
const PROJECT_KEYS = {
  all: ['project'] as const,
  lists: () => [...PROJECT_KEYS.all, 'list'] as const,
  list: (params: {
    page?: number
    size?: number
    name?: string
    status?: number
  }) => [...PROJECT_KEYS.lists(), params] as const,
  details: () => [...PROJECT_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PROJECT_KEYS.details(), id] as const,
  myProjects: () => [...PROJECT_KEYS.all, 'my'] as const,
  members: (projectId: number) => [...PROJECT_KEYS.all, 'members', projectId] as const,
  literature: (projectId: number) => [...PROJECT_KEYS.all, 'literature', projectId] as const,
}

/**
 * 使用项目列表查询。
 *
 * @param params - 查询参数
 * @param params.page - 页码
 * @param params.size - 每页数量
 * @param params.name - 项目名称关键词
 * @param params.status - 项目状态
 * @returns 分页项目列表查询结果
 */
export function useProjectList(params: {
  page?: number
  size?: number
  name?: string
  status?: number
}) {
  return useQuery<PageResponse<Project>>({
    queryKey: PROJECT_KEYS.list(params),
    queryFn: () => getProjectList(params),
  })
}

/**
 * 使用项目详情查询。
 *
 * @param id - 项目 ID
 * @returns 项目详情查询结果
 */
export function useProject(id: number) {
  return useQuery<Project>({
    queryKey: PROJECT_KEYS.detail(id),
    queryFn: () => getProjectById(id),
    enabled: !!id,
  })
}

/**
 * 使用创建项目 mutation。
 *
 * @returns 创建项目 mutation
 */
export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation<Project, Error, ProjectRequest>({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.myProjects() })
      toast.success('项目创建成功')
    },
    onError: (error) => {
      toast.error(error.message || '创建项目失败')
    },
  })
}

/**
 * 使用更新项目 mutation。
 *
 * @returns 更新项目 mutation
 */
export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation<Project, Error, { id: number; data: ProjectRequest }>({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.myProjects() })
      toast.success('项目更新成功')
    },
    onError: (error) => {
      toast.error(error.message || '更新项目失败')
    },
  })
}

/**
 * 使用删除项目 mutation。
 *
 * @returns 删除项目 mutation
 */
export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.myProjects() })
      toast.success('项目删除成功')
    },
    onError: (error) => {
      toast.error(error.message || '删除项目失败')
    },
  })
}

/**
 * 使用我的项目列表查询。
 *
 * @returns 我的项目列表查询结果
 */
export function useMyProjects() {
  return useQuery<Project[]>({
    queryKey: PROJECT_KEYS.myProjects(),
    queryFn: getMyProjects,
  })
}

// ==================== 成员管理 ====================

/**
 * 使用项目成员列表查询。
 *
 * @param projectId - 项目 ID
 * @returns 项目成员列表查询结果
 */
export function useProjectMembers(projectId: number) {
  return useQuery<ProjectMember[]>({
    queryKey: PROJECT_KEYS.members(projectId),
    queryFn: () => getProjectMembers(projectId),
    enabled: !!projectId,
  })
}

/**
 * 使用添加项目成员 mutation。
 *
 * @returns 添加成员 mutation
 */
export function useAddProjectMember() {
  const queryClient = useQueryClient()

  return useMutation<ProjectMember, Error, { projectId: number; data: AddMemberRequest }>({
    mutationFn: ({ projectId, data }) => addProjectMember(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.members(variables.projectId) })
      toast.success('成员添加成功')
    },
    onError: (error) => {
      toast.error(error.message || '添加成员失败')
    },
  })
}

/**
 * 使用移除项目成员 mutation。
 *
 * @returns 移除成员 mutation
 */
export function useRemoveProjectMember() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { projectId: number; userId: number }>({
    mutationFn: ({ projectId, userId }) => removeProjectMember(projectId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.members(variables.projectId) })
      toast.success('成员移除成功')
    },
    onError: (error) => {
      toast.error(error.message || '移除成员失败')
    },
  })
}

/**
 * 使用更新成员角色 mutation。
 *
 * @returns 更新角色 mutation
 */
export function useUpdateMemberRole() {
  const queryClient = useQueryClient()

  return useMutation<ProjectMember, Error, { projectId: number; userId: number; role: number }>({
    mutationFn: ({ projectId, userId, role }) => updateMemberRole(projectId, userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.members(variables.projectId) })
      toast.success('角色更新成功')
    },
    onError: (error) => {
      toast.error(error.message || '更新角色失败')
    },
  })
}

// ==================== 文献关联 ====================

/**
 * 使用项目文献列表查询。
 *
 * @param projectId - 项目 ID
 * @returns 项目文献列表查询结果
 */
export function useProjectLiterature(projectId: number) {
  return useQuery<Literature[]>({
    queryKey: PROJECT_KEYS.literature(projectId),
    queryFn: () => getProjectLiterature(projectId),
    enabled: !!projectId,
  })
}

/**
 * 使用添加项目文献 mutation。
 *
 * @returns 添加文献 mutation
 */
export function useAddProjectLiterature() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { projectId: number; literatureIds: number[] }>({
    mutationFn: ({ projectId, literatureIds }) => addProjectLiterature(projectId, literatureIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.literature(variables.projectId) })
      toast.success('文献关联成功')
    },
    onError: (error) => {
      toast.error(error.message || '关联文献失败')
    },
  })
}

/**
 * 使用移除项目文献 mutation。
 *
 * @returns 移除文献 mutation
 */
export function useRemoveProjectLiterature() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { projectId: number; literatureId: number }>({
    mutationFn: ({ projectId, literatureId }) => removeProjectLiterature(projectId, literatureId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.literature(variables.projectId) })
      toast.success('文献关联已取消')
    },
    onError: (error) => {
      toast.error(error.message || '取消关联失败')
    },
  })
}
