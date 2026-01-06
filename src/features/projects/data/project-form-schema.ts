import { z } from 'zod'

/**
 * 项目表单验证 Schema
 *
 * 定义项目表单的验证规则，包括项目名称、描述、状态、时间范围等字段的验证逻辑
 *
 * @author ziye
 */
export const projectFormSchema = z.object({
  name: z.string().min(1, '请输入项目名称').max(200, '项目名称不能超过200个字符'),
  description: z.string().max(2000, '项目描述不能超过2000个字符').optional(),
  status: z.coerce.number({ message: '请选择项目状态' }).min(0).max(2),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
})

/**
 * 项目表单数据类型
 *
 * 从验证 Schema 推断出的表单数据类型
 */
export type ProjectFormValues = z.infer<typeof projectFormSchema>
