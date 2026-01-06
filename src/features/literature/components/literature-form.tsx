'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import {
  literatureFormSchema,
  type LiteratureFormData,
} from '../data/literature-form-schema'
import type { Literature } from '../data/schema'
import type { LiteratureCategory } from '@/types/literature'

/**
 * 文献表单组件属性
 */
type LiteratureFormProps = {
  /** 表单 ID，用于外部提交 */
  formId: string
  /** 当前编辑的文献数据，如果为空则为新建模式 */
  currentLiterature?: Literature | null
  /** 分类树数据 */
  categories?: LiteratureCategory[]
  /** 表单提交回调 */
  onSubmit: (data: LiteratureFormData) => void
}

/**
 * 文献表单组件
 *
 * 支持新建和编辑文献，使用 React Hook Form + Zod 进行表单验证
 *
 * @param props - 文献表单属性
 * @returns 文献表单组件
 *
 * @example
 * ```tsx
 * <LiteratureForm
 *   formId="literature-form"
 *   currentLiterature={literature}
 *   categories={categoryTree}
 *   onSubmit={handleSubmit}
 * />
 * ```
 *
 * @author ziye
 */
export function LiteratureForm({
  formId,
  currentLiterature,
  categories = [],
  onSubmit,
}: LiteratureFormProps) {
  const isEdit = !!currentLiterature

  const form = useForm<LiteratureFormData>({
    resolver: zodResolver(literatureFormSchema) as never,
    defaultValues: isEdit
      ? {
          title: currentLiterature.title,
          authors: currentLiterature.authors || '',
          abstractText: currentLiterature.abstractText || '',
          keywords: currentLiterature.keywords || '',
          doi: currentLiterature.doi || '',
          publishYear:
            currentLiterature.publishYear || ('' as unknown as number),
          journal: currentLiterature.journal || '',
          categoryId:
            currentLiterature.categoryId || ('' as unknown as number),
          fileUrl: currentLiterature.fileUrl || '',
          fileSize: currentLiterature.fileSize || ('' as unknown as number),
        }
      : {
          title: '',
          authors: '',
          abstractText: '',
          keywords: '',
          doi: '',
          publishYear: '' as unknown as number,
          journal: '',
          categoryId: '' as unknown as number,
          fileUrl: '',
          fileSize: '' as unknown as number,
        },
  })

  /**
   * 扁平化分类树为选项列表
   */
  const flattenCategories = (
    cats: LiteratureCategory[],
    prefix = ''
  ): Array<{ label: string; value: string }> => {
    const result: Array<{ label: string; value: string }> = []

    cats.forEach((cat) => {
      const label = prefix ? `${prefix} / ${cat.name}` : cat.name
      result.push({
        label,
        value: String(cat.id),
      })

      if (cat.children && cat.children.length > 0) {
        result.push(...flattenCategories(cat.children, label))
      }
    })

    return result
  }

  const categoryOptions = flattenCategories(categories)

  const handleSubmit = (data: LiteratureFormData) => {
    onSubmit(data)
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-4 px-0.5'
      >
        <FormField
          control={form.control as never}
          name='title'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>
                标题 <span className='text-destructive'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入文献标题'
                  className='col-span-4'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as never}
          name='authors'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>作者</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入作者，多个作者用逗号分隔'
                  className='col-span-4'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as never}
          name='abstractText'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end pt-2'>摘要</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='请输入文献摘要'
                  className='col-span-4 min-h-24 resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as never}
          name='keywords'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>关键词</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入关键词，多个关键词用逗号分隔'
                  className='col-span-4'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as never}
          name='doi'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>DOI</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入 DOI'
                  className='col-span-4'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as never}
          name='publishYear'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>发表年份</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='请输入发表年份'
                  className='col-span-4'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as never}
          name='journal'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>期刊名称</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入期刊名称'
                  className='col-span-4'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as never}
          name='categoryId'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>分类</FormLabel>
              <SelectDropdown
                defaultValue={field.value ? String(field.value) : undefined}
                onValueChange={field.onChange}
                placeholder='请选择分类'
                className='col-span-4'
                items={categoryOptions}
              />
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as never}
          name='fileUrl'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>文件链接</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入文件链接'
                  className='col-span-4'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as never}
          name='fileSize'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>
                文件大小 (KB)
              </FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='请输入文件大小'
                  className='col-span-4'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
