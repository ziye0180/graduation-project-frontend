'use client'

import { useState } from 'react'
import { UserPlus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useProjectMembers, useRemoveProjectMember, useUpdateMemberRole } from '../hooks/use-project'
import { AddMemberDialog } from './add-member-dialog'
import type { ProjectMember } from '@/types/project'

/**
 * 角色配置
 */
const ROLE_CONFIG: Record<number, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  1: { label: '负责人', variant: 'destructive' },
  2: { label: '管理员', variant: 'default' },
  3: { label: '成员', variant: 'secondary' },
}

/**
 * 成员管理器属性
 */
type MemberManagerProps = {
  projectId: number
}

/**
 * 成员管理组件
 *
 * @description 管理项目成员，包括添加、移除和修改角色
 * @param props - 组件属性
 * @returns 成员管理组件
 *
 * @author ziye
 */
export function MemberManager({ projectId }: MemberManagerProps) {
  const { data: members, isLoading } = useProjectMembers(projectId)
  const removeMemberMutation = useRemoveProjectMember()
  const updateRoleMutation = useUpdateMemberRole()

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<ProjectMember | null>(null)

  const handleRemoveMember = () => {
    if (!selectedMember) return

    removeMemberMutation.mutate(
      { projectId, userId: selectedMember.userId },
      {
        onSuccess: () => {
          setRemoveDialogOpen(false)
          setSelectedMember(null)
        },
      }
    )
  }

  const handleRoleChange = (userId: number, role: string) => {
    updateRoleMutation.mutate({
      projectId,
      userId,
      role: Number(role),
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-48' />
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className='h-16 w-full' />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>项目成员</CardTitle>
              <CardDescription>
                管理项目成员及其角色（共 {members?.length || 0} 人）
              </CardDescription>
            </div>
            <Button onClick={() => setAddDialogOpen(true)}>
              <UserPlus className='mr-2 h-4 w-4' />
              添加成员
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!members || members.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              暂无成员，点击右上角添加成员
            </div>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>成员</TableHead>
                    <TableHead>用户名</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>加入时间</TableHead>
                    <TableHead className='text-right'>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map(member => {
                    const roleInfo = ROLE_CONFIG[member.role] || {
                      label: '未知',
                      variant: 'secondary' as const,
                    }

                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className='flex items-center gap-3'>
                            <Avatar className='h-8 w-8'>
                              <AvatarImage src={member.avatar || undefined} />
                              <AvatarFallback>
                                {getInitials(member.nickname || member.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div className='font-medium'>
                              {member.nickname || member.username}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='text-muted-foreground'>
                          {member.username}
                        </TableCell>
                        <TableCell>
                          {member.role === 1 ? (
                            <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>
                          ) : (
                            <Select
                              defaultValue={String(member.role)}
                              onValueChange={(value) => handleRoleChange(member.userId, value)}
                              disabled={updateRoleMutation.isPending}
                            >
                              <SelectTrigger className='w-[120px]'>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='2'>管理员</SelectItem>
                                <SelectItem value='3'>成员</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                        <TableCell className='text-muted-foreground'>
                          {new Date(member.joinedAt).toLocaleDateString('zh-CN')}
                        </TableCell>
                        <TableCell className='text-right'>
                          {member.role !== 1 && (
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => {
                                setSelectedMember(member)
                                setRemoveDialogOpen(true)
                              }}
                              disabled={removeMemberMutation.isPending}
                            >
                              <Trash2 className='h-4 w-4 text-destructive' />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddMemberDialog
        projectId={projectId}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />

      <ConfirmDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        handleConfirm={handleRemoveMember}
        title='移除成员'
        desc={
          <p>
            确定要移除成员{' '}
            <span className='font-bold'>
              {selectedMember?.nickname || selectedMember?.username}
            </span>{' '}
            吗？
          </p>
        }
        confirmText='移除'
        destructive
      />
    </>
  )
}
