import { api } from '@/lib/axios'
import type { Literature, LiteratureRequest, LiteratureCategory, PageResponse } from '@/types/literature'

/**
 * 分页查询文献。
 *
 * @param params - 查询参数
 * @param params.pageNum - 页码，默认 1
 * @param params.pageSize - 每页数量，默认 10
 * @param params.categoryId - 分类 ID，可选
 * @param params.keyword - 搜索关键词，可选
 * @returns 分页文献列表
 */
export async function getLiteratureList(params: {
  pageNum?: number
  pageSize?: number
  categoryId?: number
  keyword?: string
}): Promise<PageResponse<Literature>> {
  const response = await api.get<{ data: PageResponse<Literature> }>('/api/literature', {
    params: {
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 10,
      categoryId: params.categoryId,
      keyword: params.keyword,
    },
  })
  return response.data.data
}

/**
 * 获取文献详情。
 *
 * @param id - 文献 ID
 * @returns 文献详情
 */
export async function getLiteratureById(id: number): Promise<Literature> {
  const response = await api.get<{ data: Literature }>(`/api/literature/${id}`)
  return response.data.data
}

/**
 * 创建文献。
 *
 * @param data - 文献数据
 * @returns 创建的文献
 */
export async function createLiterature(data: LiteratureRequest): Promise<Literature> {
  const response = await api.post<{ data: Literature }>('/api/literature', data)
  return response.data.data
}

/**
 * 更新文献。
 *
 * @param id - 文献 ID
 * @param data - 更新的文献数据
 * @returns 更新后的文献
 */
export async function updateLiterature(id: number, data: LiteratureRequest): Promise<Literature> {
  const response = await api.put<{ data: Literature }>(`/api/literature/${id}`, data)
  return response.data.data
}

/**
 * 删除文献。
 *
 * @param id - 文献 ID
 */
export async function deleteLiterature(id: number): Promise<void> {
  await api.delete(`/api/literature/${id}`)
}

/**
 * 获取分类树。
 *
 * @returns 文献分类树
 */
export async function getCategoryTree(): Promise<LiteratureCategory[]> {
  const response = await api.get<{ data: LiteratureCategory[] }>('/api/literature/categories/tree')
  return response.data.data
}
