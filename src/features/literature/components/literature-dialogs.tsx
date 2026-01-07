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
import { LiteratureForm } from './literature-form'
import {
  useCreateLiterature,
  useUpdateLiterature,
  useDeleteLiterature,
  useCategoryTree,
} from '../hooks/use-literature'
import type { Literature } from '../data/schema'
import type { LiteratureCategory } from '@/types/literature'
import type { LiteratureFormData } from '../data/literature-form-schema'

/**
 * 文献创建对话框属性
 */
type LiteratureCreateDialogProps = {
  /** 对话框打开状态 */
  open: boolean
  /** 对话框状态改变回调 */
  onOpenChange: (open: boolean) => void
  /** 分类树数据 */
  categories?: LiteratureCategory[]
}

/**
 * 文献创建对话框
 *
 * 用于创建新的文献记录
 *
 * @param props - 对话框属性
 * @returns 文献创建对话框组件
 *
 * @author ziye
 */
export function LiteratureCreateDialog({
  open,
  onOpenChange,
  categories: propCategories,
}: LiteratureCreateDialogProps) {
  const createMutation = useCreateLiterature()
  const { data: fetchedCategories } = useCategoryTree()
  const categories = propCategories || fetchedCategories

  const handleSubmit = (data: LiteratureFormData) => {
    createMutation.mutate(
      {
        title: data.title,
        authors: data.authors || undefined,
        abstractText: data.abstractText || undefined,
        keywords: data.keywords || undefined,
        doi: data.doi || undefined,
        publishYear: data.publishYear || undefined,
        journal: data.journal || undefined,
        categoryId: data.categoryId || undefined,
        fileUrl: data.fileUrl || undefined,
        fileSize: data.fileSize || undefined,
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
          <DialogTitle>新建文献</DialogTitle>
          <DialogDescription>
            在此创建新文献记录。完成后点击保存。
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[60vh] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <LiteratureForm
            formId='literature-create-form'
            categories={categories}
            onSubmit={handleSubmit}
          />
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='literature-create-form'
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
 * 文献编辑对话框属性
 */
type LiteratureEditDialogProps = {
  /** 对话框打开状态 */
  open: boolean
  /** 对话框状态改变回调 */
  onOpenChange: (open: boolean) => void
  /** 当前编辑的文献数据 */
  currentLiterature: Literature | null
  /** 分类树数据 */
  categories?: LiteratureCategory[]
}

/**
 * 文献编辑对话框
 *
 * 用于编辑已有的文献记录
 *
 * @param props - 对话框属性
 * @returns 文献编辑对话框组件
 *
 * @author ziye
 */
export function LiteratureEditDialog({
  open,
  onOpenChange,
  currentLiterature,
  categories: propCategories,
}: LiteratureEditDialogProps) {
  const updateMutation = useUpdateLiterature()
  const { data: fetchedCategories } = useCategoryTree()
  const categories = propCategories || fetchedCategories

  const handleSubmit = (data: LiteratureFormData) => {
    if (!currentLiterature) return

    updateMutation.mutate(
      {
        id: currentLiterature.id,
        data: {
          title: data.title,
          authors: data.authors || undefined,
          abstractText: data.abstractText || undefined,
          keywords: data.keywords || undefined,
          doi: data.doi || undefined,
          publishYear: data.publishYear || undefined,
          journal: data.journal || undefined,
          categoryId: data.categoryId || undefined,
          fileUrl: data.fileUrl || undefined,
          fileSize: data.fileSize || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  if (!currentLiterature) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>编辑文献</DialogTitle>
          <DialogDescription>
            在此更新文献信息。完成后点击保存。
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[60vh] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <LiteratureForm
            formId='literature-edit-form'
            currentLiterature={currentLiterature}
            categories={categories}
            onSubmit={handleSubmit}
          />
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='literature-edit-form'
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
 * 文献删除对话框属性
 */
type LiteratureDeleteDialogProps = {
  /** 对话框打开状态 */
  open: boolean
  /** 对话框状态改变回调 */
  onOpenChange: (open: boolean) => void
  /** 当前要删除的文献数据 */
  currentLiterature: Literature | null
}

/**
 * 文献删除确认对话框
 *
 * 用于删除文献前的二次确认，需要输入文献标题以确认删除
 *
 * @param props - 对话框属性
 * @returns 文献删除对话框组件
 *
 * @author ziye
 */
export function LiteratureDeleteDialog({
  open,
  onOpenChange,
  currentLiterature,
}: LiteratureDeleteDialogProps) {
  const [value, setValue] = useState('')
  const deleteMutation = useDeleteLiterature()

  const handleDelete = () => {
    if (!currentLiterature || value.trim() !== currentLiterature.title) return

    deleteMutation.mutate(currentLiterature.id, {
      onSuccess: () => {
        onOpenChange(false)
        setValue('')
      },
    })
  }

  if (!currentLiterature) return null

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
        if (!state) setValue('')
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentLiterature.title || deleteMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />
          删除文献
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            确定要删除文献{' '}
            <span className='font-bold'>{currentLiterature.title}</span> 吗？
            <br />
            此操作将永久删除该文献记录，且无法撤销。
          </p>

          <Label className='my-2'>
            文献标题：
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='请输入文献标题以确认删除'
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
 * 文献查看对话框属性
 */
type LiteratureViewDialogProps = {
  /** 对话框打开状态 */
  open: boolean
  /** 对话框状态改变回调 */
  onOpenChange: (open: boolean) => void
  /** 当前查看的文献数据 */
  currentLiterature: Literature | null
}

/**
 * 信息行组件
 *
 * 用于展示文献详情的单行信息
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
 * 文献详情查看对话框
 *
 * 用于查看文献的详细信息，只读模式
 *
 * @param props - 对话框属性
 * @returns 文献查看对话框组件
 *
 * @author ziye
 */
export function LiteratureViewDialog({
  open,
  onOpenChange,
  currentLiterature,
}: LiteratureViewDialogProps) {
  if (!currentLiterature) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>文献详情</DialogTitle>
          <DialogDescription>查看文献的详细信息</DialogDescription>
        </DialogHeader>
        <div className='max-h-[60vh] overflow-y-auto py-1 space-y-1'>
          <InfoRow label='标题' value={currentLiterature.title} />
          <InfoRow label='作者' value={currentLiterature.authors} />
          <InfoRow label='DOI' value={currentLiterature.doi} />
          <InfoRow label='发表年份' value={currentLiterature.publishYear} />
          <InfoRow label='期刊名称' value={currentLiterature.journal} />
          <InfoRow label='分类' value={currentLiterature.categoryName} />
          <InfoRow label='关键词' value={currentLiterature.keywords} />
          <div className='grid grid-cols-6 gap-4 py-2 border-b'>
            <div className='col-span-2 text-sm font-medium text-muted-foreground text-end'>
              摘要
            </div>
            <div className='col-span-4 text-sm whitespace-pre-wrap'>
              {currentLiterature.abstractText || '-'}
            </div>
          </div>
          <InfoRow
            label='文件大小'
            value={
              currentLiterature.fileSize
                ? `${currentLiterature.fileSize} KB`
                : null
            }
          />
          {currentLiterature.fileUrl && (
            <div className='grid grid-cols-6 gap-4 py-2 border-b'>
              <div className='col-span-2 text-sm font-medium text-muted-foreground text-end'>
                文件链接
              </div>
              <div className='col-span-4 text-sm'>
                <a
                  href={currentLiterature.fileUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:underline'
                >
                  {currentLiterature.fileUrl}
                </a>
              </div>
            </div>
          )}
          <InfoRow label='上传者' value={currentLiterature.uploaderName} />
          <InfoRow
            label='创建时间'
            value={new Date(currentLiterature.createdAt).toLocaleString(
              'zh-CN'
            )}
          />
          <InfoRow
            label='更新时间'
            value={new Date(currentLiterature.updatedAt).toLocaleString(
              'zh-CN'
            )}
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
