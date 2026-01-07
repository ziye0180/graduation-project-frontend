/**
 * Mock 数据模块入口。
 * 通过环境变量 VITE_MOCK_ENABLED 控制是否启用 Mock。
 */

export const MOCK_ENABLED = import.meta.env.VITE_MOCK_ENABLED === 'true'

// Mock 数据
export * from './data/users'
export * from './data/literature'
export * from './data/literature-categories'
export * from './data/projects'
export * from './data/project-members'
export * from './data/project-literature'

// Mock 处理器
export * from './handlers/auth-handlers'
export * from './handlers/literature-handlers'
export * from './handlers/project-handlers'
