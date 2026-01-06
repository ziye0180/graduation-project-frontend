import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getLiteratureList,
  getLiteratureById,
  createLiterature,
  updateLiterature,
  deleteLiterature,
  getCategoryTree,
} from '../api/literature-api'
import type { Literature, LiteratureRequest, LiteratureCategory, PageResponse } from '@/types/literature'

/**
 * 查询键常量。
 */
const LITERATURE_KEYS = {
  all: ['literature'] as const,
  lists: () => [...LITERATURE_KEYS.all, 'list'] as const,
  list: (params: {
    pageNum?: number
    pageSize?: number
    categoryId?: number
    keyword?: string
  }) => [...LITERATURE_KEYS.lists(), params] as const,
  details: () => [...LITERATURE_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...LITERATURE_KEYS.details(), id] as const,
  categories: () => [...LITERATURE_KEYS.all, 'categories'] as const,
}

/**
 * 使用文献列表查询。
 *
 * @param params - 查询参数
 * @param params.pageNum - 页码
 * @param params.pageSize - 每页数量
 * @param params.categoryId - 分类 ID
 * @param params.keyword - 搜索关键词
 * @returns 分页文献列表查询结果
 */
export function useLiteratureList(params: {
  pageNum?: number
  pageSize?: number
  categoryId?: number
  keyword?: string
}) {
  return useQuery<PageResponse<Literature>>({
    queryKey: LITERATURE_KEYS.list(params),
    queryFn: () => getLiteratureList(params),
  })
}

/**
 * 使用文献详情查询。
 *
 * @param id - 文献 ID
 * @returns 文献详情查询结果
 */
export function useLiterature(id: number) {
  return useQuery<Literature>({
    queryKey: LITERATURE_KEYS.detail(id),
    queryFn: () => getLiteratureById(id),
    enabled: !!id,
  })
}

/**
 * 使用创建文献 mutation。
 *
 * @returns 创建文献 mutation
 */
export function useCreateLiterature() {
  const queryClient = useQueryClient()

  return useMutation<Literature, Error, LiteratureRequest>({
    mutationFn: createLiterature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LITERATURE_KEYS.lists() })
      toast.success('文献创建成功')
    },
    onError: (error) => {
      toast.error(error.message || '创建文献失败')
    },
  })
}

/**
 * 使用更新文献 mutation。
 *
 * @returns 更新文献 mutation
 */
export function useUpdateLiterature() {
  const queryClient = useQueryClient()

  return useMutation<Literature, Error, { id: number; data: LiteratureRequest }>({
    mutationFn: ({ id, data }) => updateLiterature(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: LITERATURE_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: LITERATURE_KEYS.detail(data.id) })
      toast.success('文献更新成功')
    },
    onError: (error) => {
      toast.error(error.message || '更新文献失败')
    },
  })
}

/**
 * 使用删除文献 mutation。
 *
 * @returns 删除文献 mutation
 */
export function useDeleteLiterature() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: deleteLiterature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LITERATURE_KEYS.lists() })
      toast.success('文献删除成功')
    },
    onError: (error) => {
      toast.error(error.message || '删除文献失败')
    },
  })
}

/**
 * 使用分类树查询。
 *
 * @returns 分类树查询结果
 */
export function useCategoryTree() {
  return useQuery<LiteratureCategory[]>({
    queryKey: LITERATURE_KEYS.categories(),
    queryFn: getCategoryTree,
    staleTime: 1000 * 60 * 5, // 5 分钟内不重新请求
  })
}
