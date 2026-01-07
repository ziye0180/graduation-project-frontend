'use client'

import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Edit, ArrowLeft, ExternalLink, FileText, Calendar, User, Tag, BookOpen } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useLiterature, useCategoryTree } from '../hooks/use-literature'
import { LiteratureEditDialog } from '../components/literature-dialogs'

/**
 * 文献状态映射
 */
const LITERATURE_STATUS_MAP: Record<number, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  0: { label: '已删除', variant: 'destructive' },
  1: { label: '正常', variant: 'default' },
}

/**
 * 文献详情页面
 *
 * @description 展示文献的详细信息，包括标题、作者、摘要、关键词等
 * @returns 文献详情页面组件
 *
 * @author ziye
 */
export default function LiteratureDetailPage() {
  const { id } = useParams({ from: '/_authenticated/literature/$id' })
  const navigate = useNavigate()
  const literatureId = Number(id)

  const { data: literature, isLoading } = useLiterature(literatureId)
  const { data: categories } = useCategoryTree()
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className='container mx-auto py-6 space-y-6'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-96 w-full' />
      </div>
    )
  }

  if (!literature) {
    return (
      <div className='container mx-auto py-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-muted-foreground'>文献不存在</h2>
          <Button className='mt-4' onClick={() => navigate({ to: '/literature' })}>
            返回文献列表
          </Button>
        </div>
      </div>
    )
  }

  const statusInfo = LITERATURE_STATUS_MAP[literature.status] || { label: '未知', variant: 'outline' as const }

  return (
    <div className='container mx-auto py-6 space-y-6'>
      {/* 顶部导航栏 */}
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => navigate({ to: '/literature' })}
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div className='flex-1'>
          <h1 className='text-2xl font-bold tracking-tight line-clamp-2'>{literature.title}</h1>
          <p className='text-muted-foreground'>文献详情</p>
        </div>
        <Button onClick={() => setEditDialogOpen(true)}>
          <Edit className='mr-2 h-4 w-4' />
          编辑文献
        </Button>
      </div>

      {/* 基本信息卡片 */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>文献的元数据信息</CardDescription>
            </div>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* 作者 */}
            <div className='flex items-start gap-3'>
              <User className='h-5 w-5 text-muted-foreground mt-0.5' />
              <div>
                <div className='text-sm font-medium text-muted-foreground'>作者</div>
                <div className='text-base'>{literature.authors || '-'}</div>
              </div>
            </div>

            {/* 期刊/会议 */}
            <div className='flex items-start gap-3'>
              <BookOpen className='h-5 w-5 text-muted-foreground mt-0.5' />
              <div>
                <div className='text-sm font-medium text-muted-foreground'>期刊/会议</div>
                <div className='text-base'>{literature.journal || '-'}</div>
              </div>
            </div>

            {/* 发表年份 */}
            <div className='flex items-start gap-3'>
              <Calendar className='h-5 w-5 text-muted-foreground mt-0.5' />
              <div>
                <div className='text-sm font-medium text-muted-foreground'>发表年份</div>
                <div className='text-base'>{literature.publishYear || '-'}</div>
              </div>
            </div>

            {/* 分类 */}
            <div className='flex items-start gap-3'>
              <Tag className='h-5 w-5 text-muted-foreground mt-0.5' />
              <div>
                <div className='text-sm font-medium text-muted-foreground'>分类</div>
                <div className='text-base'>
                  {literature.categoryName ? (
                    <Badge variant='outline'>{literature.categoryName}</Badge>
                  ) : '-'}
                </div>
              </div>
            </div>

            {/* DOI */}
            {literature.doi && (
              <div className='flex items-start gap-3 md:col-span-2'>
                <ExternalLink className='h-5 w-5 text-muted-foreground mt-0.5' />
                <div>
                  <div className='text-sm font-medium text-muted-foreground'>DOI</div>
                  <a
                    href={`https://doi.org/${literature.doi}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-base text-primary hover:underline'
                  >
                    {literature.doi}
                  </a>
                </div>
              </div>
            )}

            {/* 文件信息 */}
            {literature.fileUrl && (
              <div className='flex items-start gap-3 md:col-span-2'>
                <FileText className='h-5 w-5 text-muted-foreground mt-0.5' />
                <div>
                  <div className='text-sm font-medium text-muted-foreground'>附件</div>
                  <a
                    href={literature.fileUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-base text-primary hover:underline inline-flex items-center gap-1'
                  >
                    查看文件
                    <ExternalLink className='h-3 w-3' />
                  </a>
                  {literature.fileSize && (
                    <span className='text-sm text-muted-foreground ml-2'>
                      ({(literature.fileSize / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 关键词卡片 */}
      {literature.keywords && (
        <Card>
          <CardHeader>
            <CardTitle>关键词</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {literature.keywords.split(/[,，;；]/).map((keyword, index) => (
                <Badge key={index} variant='secondary'>
                  {keyword.trim()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 摘要卡片 */}
      {literature.abstractText && (
        <Card>
          <CardHeader>
            <CardTitle>摘要</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-base leading-relaxed whitespace-pre-wrap'>
              {literature.abstractText}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 其他信息 */}
      <Card>
        <CardHeader>
          <CardTitle>其他信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
            <div>
              <span className='text-muted-foreground'>上传者：</span>
              <span>{literature.uploaderName || '-'}</span>
            </div>
            <div>
              <span className='text-muted-foreground'>创建时间：</span>
              <span>{new Date(literature.createdAt).toLocaleString('zh-CN')}</span>
            </div>
            <div>
              <span className='text-muted-foreground'>更新时间：</span>
              <span>{new Date(literature.updatedAt).toLocaleString('zh-CN')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 编辑对话框 */}
      {literature && (
        <LiteratureEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          currentLiterature={literature}
          categories={categories}
        />
      )}
    </div>
  )
}
