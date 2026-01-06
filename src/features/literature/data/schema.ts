import { z } from 'zod'

/**
 * 文献数据 Schema
 *
 * @description 定义文献管理系统中的文献数据结构
 */
export const literatureSchema = z.object({
  id: z.number(),
  title: z.string(),
  authors: z.string().nullable(),
  abstractText: z.string().nullable(),
  keywords: z.string().nullable(),
  doi: z.string().nullable(),
  publishYear: z.number().nullable(),
  journal: z.string().nullable(),
  categoryId: z.number().nullable(),
  categoryName: z.string().nullable(),
  fileUrl: z.string().nullable(),
  fileSize: z.number().nullable(),
  uploaderId: z.number(),
  uploaderName: z.string().nullable(),
  status: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

/**
 * 文献类型定义
 */
export type Literature = z.infer<typeof literatureSchema>
