import type { LiteratureCategory } from '@/types/literature'

/**
 * 文献分类 Mock 数据（来自 mock-data.sql）。
 * 共 10 个分类：4 个一级分类 + 6 个二级分类。
 */
export const mockCategories: LiteratureCategory[] = [
  {
    id: 1,
    name: '计算机科学',
    parentId: null,
    sortOrder: 1,
    children: [
      {
        id: 9,
        name: '分布式系统',
        parentId: 1,
        sortOrder: 1,
        children: [],
      },
      {
        id: 10,
        name: '数据库技术',
        parentId: 1,
        sortOrder: 2,
        children: [],
      },
    ],
  },
  {
    id: 2,
    name: '人工智能',
    parentId: null,
    sortOrder: 2,
    children: [
      {
        id: 5,
        name: '机器学习',
        parentId: 2,
        sortOrder: 1,
        children: [],
      },
      {
        id: 6,
        name: '深度学习',
        parentId: 2,
        sortOrder: 2,
        children: [],
      },
      {
        id: 7,
        name: '自然语言处理',
        parentId: 2,
        sortOrder: 3,
        children: [],
      },
      {
        id: 8,
        name: '计算机视觉',
        parentId: 2,
        sortOrder: 4,
        children: [],
      },
    ],
  },
  {
    id: 3,
    name: '软件工程',
    parentId: null,
    sortOrder: 3,
    children: [],
  },
  {
    id: 4,
    name: '数据科学',
    parentId: null,
    sortOrder: 4,
    children: [],
  },
]

/**
 * 扁平化的分类列表（用于根据 ID 查找名称）。
 */
export const flatCategories: { id: number; name: string; parentId: number | null }[] = [
  { id: 1, name: '计算机科学', parentId: null },
  { id: 2, name: '人工智能', parentId: null },
  { id: 3, name: '软件工程', parentId: null },
  { id: 4, name: '数据科学', parentId: null },
  { id: 5, name: '机器学习', parentId: 2 },
  { id: 6, name: '深度学习', parentId: 2 },
  { id: 7, name: '自然语言处理', parentId: 2 },
  { id: 8, name: '计算机视觉', parentId: 2 },
  { id: 9, name: '分布式系统', parentId: 1 },
  { id: 10, name: '数据库技术', parentId: 1 },
]

/**
 * 根据 ID 查找分类名称。
 */
export function getCategoryName(categoryId: number | null): string | null {
  if (!categoryId) return null
  const category = flatCategories.find((c) => c.id === categoryId)
  return category?.name || null
}
