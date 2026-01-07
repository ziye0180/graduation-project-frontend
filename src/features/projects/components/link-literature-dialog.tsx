'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { getLiteratureList } from '@/features/literature/api/literature-api'
import { useAddProjectLiterature } from '../hooks/use-project'

/**
 * 关联文献对话框属性
 */
type LinkLiteratureDialogProps = {
  projectId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * 关联文献对话框
 *
 * @description 用于批量关联文献到项目
 * @param props - 对话框属性
 * @returns 关联文献对话框组件
 *
 * @author ziye
 */
export function LinkLiteratureDialog({
  projectId,
  open,
  onOpenChange,
}: LinkLiteratureDialogProps) {
  const [keyword, setKeyword] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['literature-search', keyword, page],
    queryFn: () => getLiteratureList({ pageNum: page, pageSize: 10, keyword }),
    enabled: open,
  })

  const addLiteratureMutation = useAddProjectLiterature()

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleToggleAll = () => {
    if (!data?.records) return

    const currentPageIds = data.records.map(l => l.id)
    const allSelected = currentPageIds.every(id => selectedIds.includes(id))

    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)))
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...currentPageIds])])
    }
  }

  const handleSubmit = () => {
    if (selectedIds.length === 0) return

    addLiteratureMutation.mutate(
      { projectId, literatureIds: selectedIds },
      {
        onSuccess: () => {
          setSelectedIds([])
          setKeyword('')
          setPage(1)
          onOpenChange(false)
        },
      }
    )
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedIds([])
      setKeyword('')
      setPage(1)
    }
    onOpenChange(open)
  }

  const allCurrentSelected = data?.records
    ? data.records.every(l => selectedIds.includes(l.id))
    : false

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-4xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>关联文献</DialogTitle>
          <DialogDescription>
            搜索并选择要关联到项目的文献（已选 {selectedIds.length} 篇）
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='flex gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='搜索文献标题、作者...'
                className='pl-9'
                value={keyword}
                onChange={e => {
                  setKeyword(e.target.value)
                  setPage(1)
                }}
              />
            </div>
          </div>

          <ScrollArea className='h-[400px] rounded-md border'>
            {isLoading ? (
              <div className='p-4 space-y-4'>
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className='h-16 w-full' />
                ))}
              </div>
            ) : !data?.records || data.records.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                {keyword ? '未找到相关文献' : '暂无文献数据'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-12'>
                      <Checkbox
                        checked={allCurrentSelected}
                        onCheckedChange={handleToggleAll}
                      />
                    </TableHead>
                    <TableHead>标题</TableHead>
                    <TableHead>作者</TableHead>
                    <TableHead>期刊</TableHead>
                    <TableHead>年份</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.records.map(literature => (
                    <TableRow key={literature.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(literature.id)}
                          onCheckedChange={() => handleToggleSelect(literature.id)}
                        />
                      </TableCell>
                      <TableCell className='font-medium'>
                        {literature.title}
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>

          {data && data.pages > 1 && (
            <div className='flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                第 {page} / {data.pages} 页，共 {data.total} 条
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  上一页
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={page === data.pages}
                  onClick={() => setPage(p => p + 1)}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => handleOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedIds.length === 0 || addLiteratureMutation.isPending}
          >
            关联 {selectedIds.length > 0 && `(${selectedIds.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
