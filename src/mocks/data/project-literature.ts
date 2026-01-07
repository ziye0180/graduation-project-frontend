import type { Literature } from '@/types/literature'
import { mockLiterature } from './literature'

/**
 * 项目文献关联数据结构。
 */
export interface ProjectLiteratureRelation {
  id: number
  projectId: number
  literatureId: number
  addedBy: number
  addedAt: string
}

/**
 * 项目文献关联 Mock 数据（来自 mock-data.sql）。
 * 共 20 条关联关系。
 */
export const mockProjectLiterature: ProjectLiteratureRelation[] = [
  // 项目1: 大语言模型研究项目 - 5篇文献
  { id: 1, projectId: 1, literatureId: 1, addedBy: 2, addedAt: '2025-01-01T00:00:00.000Z' }, // Attention
  { id: 2, projectId: 1, literatureId: 2, addedBy: 2, addedAt: '2025-01-01T00:00:00.000Z' }, // BERT
  { id: 3, projectId: 1, literatureId: 3, addedBy: 2, addedAt: '2025-01-01T00:00:00.000Z' }, // GPT-3
  { id: 4, projectId: 1, literatureId: 4, addedBy: 2, addedAt: '2025-01-01T00:00:00.000Z' }, // Word2Vec
  { id: 5, projectId: 1, literatureId: 5, addedBy: 2, addedAt: '2025-01-01T00:00:00.000Z' }, // ELMo

  // 项目2: 计算机视觉算法优化 - 4篇文献
  { id: 6, projectId: 2, literatureId: 9, addedBy: 3, addedAt: '2025-01-02T00:00:00.000Z' }, // AlexNet
  { id: 7, projectId: 2, literatureId: 10, addedBy: 3, addedAt: '2025-01-02T00:00:00.000Z' }, // ResNet
  { id: 8, projectId: 2, literatureId: 6, addedBy: 3, addedAt: '2025-01-02T00:00:00.000Z' }, // Dropout
  { id: 9, projectId: 2, literatureId: 7, addedBy: 3, addedAt: '2025-01-02T00:00:00.000Z' }, // BatchNorm

  // 项目3: 分布式存储系统设计 - 5篇文献
  { id: 10, projectId: 3, literatureId: 12, addedBy: 4, addedAt: '2025-01-03T00:00:00.000Z' }, // MapReduce
  { id: 11, projectId: 3, literatureId: 13, addedBy: 4, addedAt: '2025-01-03T00:00:00.000Z' }, // GFS
  { id: 12, projectId: 3, literatureId: 14, addedBy: 4, addedAt: '2025-01-03T00:00:00.000Z' }, // Bigtable
  { id: 13, projectId: 3, literatureId: 15, addedBy: 4, addedAt: '2025-01-03T00:00:00.000Z' }, // Dynamo
  { id: 14, projectId: 3, literatureId: 16, addedBy: 4, addedAt: '2025-01-03T00:00:00.000Z' }, // Spanner

  // 项目4: 智能问答系统开发 - 3篇文献
  { id: 15, projectId: 4, literatureId: 2, addedBy: 5, addedAt: '2025-01-04T00:00:00.000Z' }, // BERT
  { id: 16, projectId: 4, literatureId: 3, addedBy: 5, addedAt: '2025-01-04T00:00:00.000Z' }, // GPT-3
  { id: 17, projectId: 4, literatureId: 5, addedBy: 5, addedAt: '2025-01-04T00:00:00.000Z' }, // ELMo

  // 项目5: 代码质量分析工具 - 2篇文献
  { id: 18, projectId: 5, literatureId: 17, addedBy: 2, addedAt: '2025-01-05T00:00:00.000Z' }, // Design Patterns
  { id: 19, projectId: 5, literatureId: 18, addedBy: 2, addedAt: '2025-01-05T00:00:00.000Z' }, // Clean Code

  // 项目6: 深度学习框架比较研究 - 1篇文献
  { id: 20, projectId: 6, literatureId: 11, addedBy: 6, addedAt: '2025-01-06T00:00:00.000Z' }, // Adam
]

/**
 * 获取项目关联的文献列表。
 */
export function getProjectLiteratureList(projectId: number): Literature[] {
  const relations = mockProjectLiterature.filter((r) => r.projectId === projectId)
  const literatureIds = relations.map((r) => r.literatureId)
  return mockLiterature.filter((l) => literatureIds.includes(l.id))
}

/**
 * 检查文献是否已关联到项目。
 */
export function isLiteratureLinked(projectId: number, literatureId: number): boolean {
  return mockProjectLiterature.some(
    (r) => r.projectId === projectId && r.literatureId === literatureId
  )
}

/**
 * 获取下一个关联 ID。
 */
export function getNextRelationId(): number {
  return Math.max(...mockProjectLiterature.map((r) => r.id)) + 1
}
