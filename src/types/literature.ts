/**
 * 文献信息。
 */
export interface Literature {
  id: number
  title: string
  authors: string | null
  abstract_text: string | null
  keywords: string | null
  doi: string | null
  publish_year: number | null
  journal: string | null
  category_id: number | null
  category_name: string | null
  file_url: string | null
  file_size: number | null
  uploader_id: number
  uploader_name: string | null
  status: number
  created_at: string
  updated_at: string
}

/**
 * 文献请求参数。
 */
export interface LiteratureRequest {
  title: string
  authors?: string
  abstract_text?: string
  keywords?: string
  doi?: string
  publish_year?: number
  journal?: string
  category_id?: number
  file_url?: string
  file_size?: number
}

/**
 * 文献分类。
 */
export interface LiteratureCategory {
  id: number
  name: string
  parent_id: number | null
  sort_order: number
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
