import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { changePassword } from '../api/auth-api'

/**
 * 修改密码 mutation hook。
 *
 * @returns TanStack Query mutation 对象
 *
 * @author ziye
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('密码修改成功')
    },
    onError: (error: Error) => {
      toast.error(error.message || '密码修改失败')
    },
  })
}
