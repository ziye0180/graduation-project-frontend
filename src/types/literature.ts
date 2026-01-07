/**
 * 文献信息。
 */
export interface Literature {
  id: number
  title: string
  authors: string | null
  abstractText: string | null
  keywords: string | null
  doi: string | null
  publishYear: number | null
  journal: string | null
  categoryId: number | null
  categoryName: string | null
  fileUrl: string | null
  fileSize: number | null
  uploaderId: number
  uploaderName: string | null
  status: number
  statusDescription: string
  createdAt: string
  updatedAt: string
}

/**
 * 文献请求参数。
 */
export interface LiteratureRequest {
  title: string
  authors?: string
  abstractText?: string
  keywords?: string
  doi?: string
  publishYear?: number
  journal?: string
  categoryId?: number
  fileUrl?: string
  fileSize?: number
}

/**
 * 文献分类。
 */
export interface LiteratureCategory {
  id: number
  name: string
  parentId: number | null
  sortOrder: number
  children: LiteratureCategory[]
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
