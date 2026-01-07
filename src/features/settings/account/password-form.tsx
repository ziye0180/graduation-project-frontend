'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useChangePassword } from '@/features/auth/hooks/use-auth'

/**
 * 密码修改表单 schema
 */
const passwordFormSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, '请输入原密码')
      .min(6, '密码至少需要6个字符'),
    newPassword: z
      .string()
      .min(1, '请输入新密码')
      .min(6, '密码至少需要6个字符')
      .max(32, '密码不能超过32个字符'),
    confirmPassword: z.string().min(1, '请确认新密码'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: '新密码不能与原密码相同',
    path: ['newPassword'],
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

/**
 * 密码修改表单组件
 *
 * 用于用户修改登录密码
 *
 * @returns 密码修改表单
 *
 * @author ziye
 */
export function PasswordForm() {
  const changePasswordMutation = useChangePassword()

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  function onSubmit(data: PasswordFormValues) {
    changePasswordMutation.mutate(
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          form.reset()
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='oldPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>原密码</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='请输入原密码'
                  autoComplete='current-password'
                  {...field}
                />
              </FormControl>
              <FormDescription>请输入您当前使用的密码。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>新密码</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='请输入新密码'
                  autoComplete='new-password'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                新密码需要6-32个字符，建议使用字母、数字和特殊字符的组合。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>确认新密码</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='请再次输入新密码'
                  autoComplete='new-password'
                  {...field}
                />
              </FormControl>
              <FormDescription>请再次输入新密码以确认。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={changePasswordMutation.isPending}>
          {changePasswordMutation.isPending ? '修改中...' : '修改密码'}
        </Button>
      </form>
    </Form>
  )
}
