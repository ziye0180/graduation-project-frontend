'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { ProjectForm } from './project-form'
import type { Project } from '@/types/project'
import type { ProjectFormValues } from '../data/project-form-schema'
import { useCreateProject, useUpdateProject, useDeleteProject } from '../hooks/use-project'

/**
 * 项目状态映射
 */
const PROJECT_STATUS_MAP: Record<number, string> = {
  0: '已归档',
  1: '进行中',
  2: '已完成',
}

/**
 * 项目创建对话框属性
 */
type ProjectCreateDialogProps = {
  /** 对话框打开状态 */
  open: boolean
  /** 对话框状态改变回调 */
  onOpenChange: (open: boolean) => void
}

/**
 * 项目创建对话框
 *
 * 用于创建新的项目记录
 *
 * @param props - 对话框属性
 * @returns 项目创建对话框组件
 *
 * @author ziye
 */
export function ProjectCreateDialog({
  open,
  onOpenChange,
}: ProjectCreateDialogProps) {
  const createMutation = useCreateProject()

  const handleSubmit = (data: ProjectFormValues) => {
    createMutation.mutate(
      {
        name: data.name,
        description: data.description || undefined,
        status: data.status,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>新建项目</DialogTitle>
          <DialogDescription>
            在此创建新项目记录。完成后点击保存。
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[60vh] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <ProjectForm
            formId='project-create-form'
            onSubmit={handleSubmit}
          />
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='project-create-form'
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * 项目编辑对话框属性
 */
type ProjectEditDialogProps = {
  /** 对话框打开状态 */
  open: boolean
  /** 对话框状态改变回调 */
  onOpenChange: (open: boolean) => void
  /** 当前编辑的项目数据 */
  currentProject: Project | null
}

/**
 * 项目编辑对话框
 *
 * 用于编辑已有的项目记录
 *
 * @param props - 对话框属性
 * @returns 项目编辑对话框组件
 *
 * @author ziye
 */
export function ProjectEditDialog({
  open,
  onOpenChange,
  currentProject,
}: ProjectEditDialogProps) {
  const updateMutation = useUpdateProject()

  const handleSubmit = (data: ProjectFormValues) => {
    if (!currentProject) return

    updateMutation.mutate(
      {
        id: currentProject.id,
        data: {
          name: data.name,
          description: data.description || undefined,
          status: data.status,
          startDate: data.startDate || undefined,
          endDate: data.endDate || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  if (!currentProject) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>编辑项目</DialogTitle>
          <DialogDescription>
            在此更新项目信息。完成后点击保存。
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[60vh] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <ProjectForm
            formId='project-edit-form'
            currentProject={currentProject}
            onSubmit={handleSubmit}
          />
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='project-edit-form'
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * 项目删除对话框属性
 */
type ProjectDeleteDialogProps = {
  /** 对话框打开状态 */
  open: boolean
  /** 对话框状态改变回调 */
  onOpenChange: (open: boolean) => void
  /** 当前要删除的项目数据 */
  currentProject: Project | null
}

/**
 * 项目删除确认对话框
 *
 * 用于删除项目前的二次确认，需要输入项目名称以确认删除
 *
 * @param props - 对话框属性
 * @returns 项目删除对话框组件
 *
 * @author ziye
 */
export function ProjectDeleteDialog({
  open,
  onOpenChange,
  currentProject,
}: ProjectDeleteDialogProps) {
  const [value, setValue] = useState('')
  const deleteMutation = useDeleteProject()

  const handleDelete = () => {
    if (!currentProject || value.trim() !== currentProject.name) return

    deleteMutation.mutate(currentProject.id, {
      onSuccess: () => {
        onOpenChange(false)
        setValue('')
      },
    })
  }

  if (!currentProject) return null

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
        if (!state) setValue('')
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentProject.name || deleteMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />
          删除项目
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            确定要删除项目{' '}
            <span className='font-bold'>{currentProject.name}</span> 吗？
            <br />
            此操作将永久删除该项目记录，且无法撤销。
          </p>

          <Label className='my-2'>
            项目名称：
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='请输入项目名称以确认删除'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>警告！</AlertTitle>
            <AlertDescription>请谨慎操作，此操作无法回滚。</AlertDescription>
          </Alert>
        </div>
      }
      confirmText={deleteMutation.isPending ? '删除中...' : '删除'}
      destructive
    />
  )
}

/**
 * 项目查看对话框属性
 */
type ProjectViewDialogProps = {
  /** 对话框打开状态 */
  open: boolean
  /** 对话框状态改变回调 */
  onOpenChange: (open: boolean) => void
  /** 当前查看的项目数据 */
  currentProject: Project | null
}

/**
 * 信息行组件
 *
 * 用于展示项目详情的单行信息
 */
function InfoRow({
  label,
  value,
}: {
  label: string
  value: string | number | null
}) {
  return (
    <div className='grid grid-cols-6 gap-4 py-2 border-b'>
      <div className='col-span-2 text-sm font-medium text-muted-foreground text-end'>
        {label}
      </div>
      <div className='col-span-4 text-sm'>{value || '-'}</div>
    </div>
  )
}

/**
 * 项目详情查看对话框
 *
 * 用于查看项目的详细信息，只读模式
 *
 * @param props - 对话框属性
 * @returns 项目查看对话框组件
 *
 * @author ziye
 */
export function ProjectViewDialog({
  open,
  onOpenChange,
  currentProject,
}: ProjectViewDialogProps) {
  if (!currentProject) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>项目详情</DialogTitle>
          <DialogDescription>查看项目的详细信息</DialogDescription>
        </DialogHeader>
        <div className='max-h-[60vh] overflow-y-auto py-1 space-y-1'>
          <InfoRow label='项目名称' value={currentProject.name} />
          <InfoRow
            label='项目状态'
            value={PROJECT_STATUS_MAP[currentProject.status] || '-'}
          />
          <InfoRow
            label='开始日期'
            value={
              currentProject.startDate
                ? new Date(currentProject.startDate).toLocaleDateString('zh-CN')
                : null
            }
          />
          <InfoRow
            label='结束日期'
            value={
              currentProject.endDate
                ? new Date(currentProject.endDate).toLocaleDateString('zh-CN')
                : null
            }
          />
          <div className='grid grid-cols-6 gap-4 py-2 border-b'>
            <div className='col-span-2 text-sm font-medium text-muted-foreground text-end'>
              项目描述
            </div>
            <div className='col-span-4 text-sm whitespace-pre-wrap'>
              {currentProject.description || '-'}
            </div>
          </div>
          <InfoRow label='创建者' value={currentProject.ownerName} />
          <InfoRow
            label='创建时间'
            value={new Date(currentProject.createdAt).toLocaleString('zh-CN')}
          />
          <InfoRow
            label='更新时间'
            value={new Date(currentProject.updatedAt).toLocaleString('zh-CN')}
          />
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
