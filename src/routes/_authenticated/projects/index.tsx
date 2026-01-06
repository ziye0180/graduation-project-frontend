import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import ProjectsPage from '@/features/projects'

/**
 * 项目列表页面的 URL 搜索参数 Schema
 */
const projectSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  filter: z.string().optional().catch(''),
  status: z.number().optional(),
})

export const Route = createFileRoute('/_authenticated/projects/')({
  validateSearch: projectSearchSchema,
  component: ProjectsPage,
})
