import { z } from 'zod'

/**
 * 项目数据 Schema
 *
 * @description 定义项目管理系统中的项目数据结构
 *
 * @author ziye
 */
export const projectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  status: z.number(),
  statusDescription: z.string(),
  ownerId: z.number(),
  ownerName: z.string(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

/**
 * 项目类型定义
 */
export type Project = z.infer<typeof projectSchema>
