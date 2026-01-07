import type { Literature, LiteratureRequest, LiteratureCategory, PageResponse } from '@/types/literature'
import { mockLiterature, getNextLiteratureId } from '../data/literature'
import { mockCategories, getCategoryName } from '../data/literature-categories'
import { mockUsers } from '../data/users'

/**
 * 模拟网络延迟。
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 可变的文献数据（用于 CRUD 操作）。
 */
let literatureData = [...mockLiterature]

/**
 * 重置文献数据（测试用）。
 */
export function resetLiteratureData() {
  literatureData = [...mockLiterature]
}

/**
 * Mock 获取文献列表（分页 + 搜索 + 分类筛选）。
 */
export async function mockGetLiteratureList(params: {
  pageNum?: number
  pageSize?: number
  categoryId?: number
  keyword?: string
}): Promise<PageResponse<Literature>> {
  await delay(300)

  let filtered = literatureData.filter((l) => l.status === 1)

  // 分类筛选
  if (params.categoryId) {
    filtered = filtered.filter((l) => l.categoryId === params.categoryId)
  }

  // 关键词搜索（标题、作者、关键词）
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(keyword) ||
        l.authors?.toLowerCase().includes(keyword) ||
        l.keywords?.toLowerCase().includes(keyword) ||
        l.journal?.toLowerCase().includes(keyword)
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
 * Mock 获取文献详情。
 */
export async function mockGetLiteratureById(id: number): Promise<Literature> {
  await delay(200)

  const literature = literatureData.find((l) => l.id === id && l.status === 1)

  if (!literature) {
    throw new Error('文献不存在')
  }

  return literature
}

/**
 * Mock 创建文献。
 */
export async function mockCreateLiterature(
  data: LiteratureRequest,
  uploaderId: number = 1
): Promise<Literature> {
  await delay(500)

  const uploader = mockUsers.find((u) => u.id === uploaderId)

  const newLiterature: Literature = {
    id: getNextLiteratureId(),
    title: data.title,
    authors: data.authors || null,
    abstractText: data.abstractText || null,
    keywords: data.keywords || null,
    doi: data.doi || null,
    publishYear: data.publishYear || null,
    journal: data.journal || null,
    categoryId: data.categoryId || null,
    categoryName: getCategoryName(data.categoryId || null),
    fileUrl: data.fileUrl || null,
    fileSize: data.fileSize || null,
    uploaderId,
    uploaderName: uploader?.nickname || uploader?.username || null,
    status: 1,
    statusDescription: '正常',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  literatureData.push(newLiterature)
  return newLiterature
}

/**
 * Mock 更新文献。
 */
export async function mockUpdateLiterature(
  id: number,
  data: LiteratureRequest
): Promise<Literature> {
  await delay(500)

  const index = literatureData.findIndex((l) => l.id === id)

  if (index === -1) {
    throw new Error('文献不存在')
  }

  const updated: Literature = {
    ...literatureData[index],
    title: data.title,
    authors: data.authors || null,
    abstractText: data.abstractText || null,
    keywords: data.keywords || null,
    doi: data.doi || null,
    publishYear: data.publishYear || null,
    journal: data.journal || null,
    categoryId: data.categoryId || null,
    categoryName: getCategoryName(data.categoryId || null),
    fileUrl: data.fileUrl || null,
    fileSize: data.fileSize || null,
    updatedAt: new Date().toISOString(),
  }

  literatureData[index] = updated
  return updated
}

/**
 * Mock 删除文献（软删除）。
 */
export async function mockDeleteLiterature(id: number): Promise<void> {
  await delay(300)

  const index = literatureData.findIndex((l) => l.id === id)

  if (index === -1) {
    throw new Error('文献不存在')
  }

  // 软删除
  literatureData[index] = {
    ...literatureData[index],
    status: 0,
    statusDescription: '已删除',
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Mock 获取分类树。
 */
export async function mockGetCategoryTree(): Promise<LiteratureCategory[]> {
  await delay(200)
  return mockCategories
}
