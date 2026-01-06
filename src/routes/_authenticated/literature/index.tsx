import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Literature } from '@/features/literature'

/**
 * 文献列表页面的 URL 搜索参数 Schema
 */
const literatureSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  filter: z.string().optional().catch(''),
  categoryId: z.number().optional(),
})

export const Route = createFileRoute('/_authenticated/literature/')({
  validateSearch: literatureSearchSchema,
  component: Literature,
})
