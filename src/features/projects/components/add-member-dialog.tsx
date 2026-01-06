'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAddProjectMember } from '../hooks/use-project'

/**
 * 添加成员表单 Schema
 */
const addMemberSchema = z.object({
  userId: z.string().min(1, '请输入用户 ID'),
  role: z.string().min(1, '请选择角色'),
})

type AddMemberFormValues = z.infer<typeof addMemberSchema>

/**
 * 添加成员对话框属性
 */
type AddMemberDialogProps = {
  projectId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * 添加成员对话框
 *
 * @description 用于向项目添加新成员
 * @param props - 对话框属性
 * @returns 添加成员对话框组件
 *
 * @author ziye
 */
export function AddMemberDialog({
  projectId,
  open,
  onOpenChange,
}: AddMemberDialogProps) {
  const addMemberMutation = useAddProjectMember()

  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      userId: '',
      role: '3',
    },
  })

  const handleSubmit = (data: AddMemberFormValues) => {
    addMemberMutation.mutate(
      {
        projectId,
        data: {
          userId: Number(data.userId),
          role: Number(data.role),
        },
      },
      {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
      }
    )
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>添加成员</DialogTitle>
          <DialogDescription>
            向项目添加新成员，并设置其角色
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='add-member-form'
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='userId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    用户 ID <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='请输入用户 ID'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    角色 <span className='text-destructive'>*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='请选择角色' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='2'>管理员</SelectItem>
                      <SelectItem value='3'>成员</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => handleOpenChange(false)}
          >
            取消
          </Button>
          <Button
            type='submit'
            form='add-member-form'
            disabled={addMemberMutation.isPending}
          >
            添加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
