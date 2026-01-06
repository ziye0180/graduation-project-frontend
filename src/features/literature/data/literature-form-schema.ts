import { z } from 'zod'

/**
 * 文献表单验证 Schema
 *
 * 定义文献表单的验证规则，包括标题、作者、摘要、关键词等字段的验证逻辑
 *
 * @author ziye
 */
export const literatureFormSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(500, '标题最多500字符'),
  authors: z.string().max(500, '作者最多500字符').optional(),
  abstractText: z.string().max(5000, '摘要最多5000字符').optional(),
  keywords: z.string().max(500, '关键词最多500字符').optional(),
  doi: z.string().max(100, 'DOI最多100字符').optional(),
  publishYear: z.coerce
    .number({ invalid_type_error: '请输入有效的年份' })
    .min(1900, '年份不能早于1900年')
    .max(2100, '年份不能晚于2100年')
    .optional()
    .or(z.literal('')),
  journal: z.string().max(200, '期刊名称最多200字符').optional(),
  categoryId: z.coerce
    .number({ invalid_type_error: '请选择有效的分类' })
    .optional()
    .or(z.literal('')),
  fileUrl: z.string().url('请输入有效的URL').optional().or(z.literal('')),
  fileSize: z.coerce
    .number({ invalid_type_error: '请输入有效的文件大小' })
    .optional()
    .or(z.literal('')),
})

/**
 * 文献表单数据类型
 *
 * 从验证 Schema 推断出的表单数据类型
 */
export type LiteratureFormData = z.infer<typeof literatureFormSchema>
