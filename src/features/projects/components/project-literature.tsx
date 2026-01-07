'use client'

import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Link2, Trash2, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useProjectLiterature, useRemoveProjectLiterature } from '../hooks/use-project'
import { LinkLiteratureDialog } from './link-literature-dialog'
import type { Literature } from '@/types/literature'

/**
 * 项目文献组件属性
 */
type ProjectLiteratureProps = {
  projectId: number
}

/**
 * 项目文献关联组件
 *
 * @description 管理项目关联的文献，包括添加和移除
 * @param props - 组件属性
 * @returns 项目文献组件
 *
 * @author ziye
 */
export function ProjectLiterature({ projectId }: ProjectLiteratureProps) {
  const navigate = useNavigate()
  const { data: literatures, isLoading } = useProjectLiterature(projectId)
  const removeLiteratureMutation = useRemoveProjectLiterature()

  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [selectedLiterature, setSelectedLiterature] = useState<Literature | null>(null)

  const handleRemoveLiterature = () => {
    if (!selectedLiterature) return

    removeLiteratureMutation.mutate(
      { projectId, literatureId: selectedLiterature.id },
      {
        onSuccess: () => {
          setRemoveDialogOpen(false)
          setSelectedLiterature(null)
        },
      }
    )
  }

  const handleLiteratureClick = (literatureId: number) => {
    navigate({ to: `/literature/${literatureId}` })
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
              <CardTitle>关联文献</CardTitle>
              <CardDescription>
                项目相关的文献资料（共 {literatures?.length || 0} 篇）
              </CardDescription>
            </div>
            <Button onClick={() => setLinkDialogOpen(true)}>
              <Link2 className='mr-2 h-4 w-4' />
              关联文献
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!literatures || literatures.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              暂无关联文献，点击右上角关联文献
            </div>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>标题</TableHead>
                    <TableHead>作者</TableHead>
                    <TableHead>期刊</TableHead>
                    <TableHead>年份</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead className='text-right'>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {literatures.map(literature => (
                    <TableRow key={literature.id}>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <button
                            className='font-medium hover:underline text-left'
                            onClick={() => handleLiteratureClick(literature.id)}
                          >
                            {literature.title}
                          </button>
                          <ExternalLink className='h-3 w-3 text-muted-foreground' />
                        </div>
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {literature.authors || '-'}
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {literature.journal || '-'}
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {literature.publishYear || '-'}
                      </TableCell>
                      <TableCell>
                        {literature.categoryName ? (
                          <Badge variant='outline'>{literature.categoryName}</Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => {
                            setSelectedLiterature(literature)
                            setRemoveDialogOpen(true)
                          }}
                          disabled={removeLiteratureMutation.isPending}
                        >
                          <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <LinkLiteratureDialog
        projectId={projectId}
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
      />

      <ConfirmDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        handleConfirm={handleRemoveLiterature}
        title='取消关联'
        desc={
          <p>
            确定要取消关联文献{' '}
            <span className='font-bold'>{selectedLiterature?.title}</span> 吗？
          </p>
        }
        confirmText='取消关联'
        destructive
      />
    </>
  )
}
