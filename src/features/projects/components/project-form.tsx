'use client'

import { useForm, type SubmitHandler } from 'react-hook-form'
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
  projectFormSchema,
  type ProjectFormValues,
} from '../data/project-form-schema'
import type { Project } from '@/types/project'

/**
 * 项目状态选项
 */
const PROJECT_STATUS_OPTIONS = [
  { label: '进行中', value: '1' },
  { label: '已完成', value: '2' },
  { label: '已归档', value: '0' },
]

/**
 * 项目表单组件属性
 */
type ProjectFormProps = {
  /** 表单 ID，用于外部提交 */
  formId: string
  /** 当前编辑的项目数据，如果为空则为新建模式 */
  currentProject?: Project | null
  /** 表单提交回调 */
  onSubmit: (data: ProjectFormValues) => void
}

/**
 * 项目表单组件
 *
 * 支持新建和编辑项目，使用 React Hook Form + Zod 进行表单验证
 *
 * @param props - 项目表单属性
 * @returns 项目表单组件
 *
 * @example
 * ```tsx
 * <ProjectForm
 *   formId="project-form"
 *   currentProject={project}
 *   onSubmit={handleSubmit}
 * />
 * ```
 *
 * @author ziye
 */
export function ProjectForm({
  formId,
  currentProject,
  onSubmit,
}: ProjectFormProps) {
  const isEdit = !!currentProject

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema) as never,
    defaultValues: isEdit
      ? {
          name: currentProject.name,
          description: currentProject.description || '',
          status: currentProject.status,
          startDate: currentProject.startDate || '',
          endDate: currentProject.endDate || '',
        }
      : {
          name: '',
          description: '',
          status: 1,
          startDate: '',
          endDate: '',
        },
  })

  const handleSubmit: SubmitHandler<ProjectFormValues> = (data) => {
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
          name='name'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>
                项目名称 <span className='text-destructive'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入项目名称'
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
          name='description'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end pt-2'>
                项目描述
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder='请输入项目描述'
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
          name='status'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>
                项目状态 <span className='text-destructive'>*</span>
              </FormLabel>
              <SelectDropdown
                defaultValue={String(field.value)}
                onValueChange={field.onChange}
                placeholder='请选择项目状态'
                className='col-span-4'
                items={PROJECT_STATUS_OPTIONS}
              />
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as never}
          name='startDate'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>开始日期</FormLabel>
              <FormControl>
                <Input
                  type='date'
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
          name='endDate'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>结束日期</FormLabel>
              <FormControl>
                <Input
                  type='date'
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
