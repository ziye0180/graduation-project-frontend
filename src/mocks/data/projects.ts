import type { Project } from '@/types/project'

/**
 * 项目状态枚举。
 */
export const PROJECT_STATUS = {
  ARCHIVED: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
} as const

/**
 * 项目状态描述映射。
 */
export const PROJECT_STATUS_MAP: Record<number, string> = {
  0: '已归档',
  1: '进行中',
  2: '已完成',
}

/**
 * 项目 Mock 数据（来自 mock-data.sql）。
 * 共 6 个项目，涵盖不同状态。
 */
export const mockProjects: Project[] = [
  {
    id: 1,
    name: '大语言模型研究项目',
    description:
      '研究大语言模型的训练方法、优化策略及应用场景，探索 Transformer 架构的改进方向。',
    status: 1,
    statusDescription: '进行中',
    ownerId: 2,
    ownerName: 'lihan',
    startDate: '2025-09-01',
    endDate: '2026-06-30',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: '计算机视觉算法优化',
    description:
      '针对目标检测和图像分割算法进行性能优化，研究轻量化模型在边缘设备上的部署方案。',
    status: 1,
    statusDescription: '进行中',
    ownerId: 3,
    ownerName: 'zhangsan',
    startDate: '2025-10-01',
    endDate: '2026-05-31',
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
  {
    id: 3,
    name: '分布式存储系统设计',
    description:
      '设计并实现一个高可用、高性能的分布式存储系统，支持自动故障转移和数据一致性保证。',
    status: 1,
    statusDescription: '进行中',
    ownerId: 4,
    ownerName: 'lisi',
    startDate: '2025-11-01',
    endDate: '2026-08-31',
    createdAt: '2025-01-03T00:00:00.000Z',
    updatedAt: '2025-01-03T00:00:00.000Z',
  },
  {
    id: 4,
    name: '智能问答系统开发',
    description:
      '基于大语言模型开发智能问答系统，支持多轮对话和知识库检索增强。',
    status: 0,
    statusDescription: '已归档',
    ownerId: 5,
    ownerName: 'wangwu',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    createdAt: '2025-01-04T00:00:00.000Z',
    updatedAt: '2025-01-04T00:00:00.000Z',
  },
  {
    id: 5,
    name: '代码质量分析工具',
    description:
      '开发一款静态代码分析工具，支持多种编程语言，检测代码规范和潜在 Bug。',
    status: 1,
    statusDescription: '进行中',
    ownerId: 2,
    ownerName: 'lihan',
    startDate: '2025-08-01',
    endDate: '2026-03-31',
    createdAt: '2025-01-05T00:00:00.000Z',
    updatedAt: '2025-01-05T00:00:00.000Z',
  },
  {
    id: 6,
    name: '深度学习框架比较研究',
    description:
      '对主流深度学习框架（PyTorch、TensorFlow、JAX）进行性能对比和易用性分析。',
    status: 2,
    statusDescription: '已完成',
    ownerId: 6,
    ownerName: 'zhaoliu',
    startDate: '2025-06-01',
    endDate: '2025-12-31',
    createdAt: '2025-01-06T00:00:00.000Z',
    updatedAt: '2025-01-06T00:00:00.000Z',
  },
]

/**
 * 获取下一个项目 ID。
 */
export function getNextProjectId(): number {
  return Math.max(...mockProjects.map((p) => p.id)) + 1
}
