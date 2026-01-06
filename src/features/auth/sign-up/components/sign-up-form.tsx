import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { cn } from '@/lib/utils'
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
import { PasswordInput } from '@/components/password-input'
import { register } from '@/features/auth/api/auth-api'
import { useAuthStore } from '@/stores/auth-store'
import type { AuthUser } from '@/types/auth'

const formSchema = z
  .object({
    email: z.email({
      error: (iss) =>
        iss.input === '' ? '请输入邮箱' : undefined,
    }),
    password: z
      .string()
      .min(1, '请输入密码')
      .min(7, '密码至少需要7个字符'),
    confirmPassword: z.string().min(1, '请确认密码'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

/**
 * 注册表单组件。
 *
 * 提供用户注册功能，包括邮箱、密码输入和第三方登录选项。
 * 注册成功后自动登录并跳转到首页。
 *
 * @param className - 额外的类名
 * @param props - 其他表单属性
 */
export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const auth = useAuthStore((state) => state.auth)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  /**
   * 处理表单提交。
   *
   * 调用注册 API，成功后自动登录并跳转到首页。
   *
   * @param data - 表单数据
   */
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // 从邮箱提取用户名（@之前的部分）
      const username = data.email.split('@')[0]

      const response = await register({
        username,
        email: data.email,
        password: data.password,
      })

      // 构建认证用户信息
      const authUser: AuthUser = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        nickname: response.user.nickname,
        avatar: response.user.avatar,
        status: response.user.status,
      }

      // 保存认证信息到 store
      auth.setAuth(authUser, response.access_token)

      toast.success('注册成功！')

      // 跳转到首页
      navigate({ to: '/', replace: true })
    } catch {
      // 错误由 axios 拦截器统一处理
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>确认密码</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          创建账户
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              或使用以下方式注册
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button
            variant='outline'
            className='w-full'
            type='button'
            disabled={isLoading}
          >
            <IconGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button
            variant='outline'
            className='w-full'
            type='button'
            disabled={isLoading}
          >
            <IconFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
