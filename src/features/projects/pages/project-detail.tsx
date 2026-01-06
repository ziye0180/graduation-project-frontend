'use client'

import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Edit, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useProject } from '../hooks/use-project'
import { MemberManager } from '../components/member-manager'
import { ProjectLiterature } from '../components/project-literature'
import { EditProjectDialog } from '../components/project-dialogs'

/**
 * 项目状态映射
 */
const PROJECT_STATUS_MAP: Record<number, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  0: { label: '进行中', variant: 'default' },
  1: { label: '已完成', variant: 'secondary' },
  2: { label: '已归档', variant: 'outline' },
}

/**
 * 项目详情页面
 *
 * @description 展示项目的详细信息，包括基本信息、成员管理和文献关联
 * @returns 项目详情页面组件
 *
 * @author ziye
 */
export default function ProjectDetailPage() {
  const { id } = useParams({ from: '/_authenticated/projects/$id' })
  const navigate = useNavigate()
  const projectId = Number(id)

  const { data: project, isLoading } = useProject(projectId)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className='container mx-auto py-6 space-y-6'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-96 w-full' />
      </div>
    )
  }

  if (!project) {
    return (
      <div className='container mx-auto py-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-muted-foreground'>项目不存在</h2>
          <Button className='mt-4' onClick={() => navigate({ to: '/projects' })}>
            返回项目列表
          </Button>
        </div>
      </div>
    )
  }

  const statusInfo = PROJECT_STATUS_MAP[project.status] || { label: '未知', variant: 'outline' as const }

  return (
    <div className='container mx-auto py-6 space-y-6'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => navigate({ to: '/projects' })}
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold tracking-tight'>{project.name}</h1>
          <p className='text-muted-foreground'>项目详情</p>
        </div>
        <Button onClick={() => setEditDialogOpen(true)}>
          <Edit className='mr-2 h-4 w-4' />
          编辑项目
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>项目的详细信息</CardDescription>
            </div>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <div className='text-sm font-medium text-muted-foreground'>项目负责人</div>
              <div className='text-base'>{project.ownerName}</div>
            </div>
            <div className='space-y-2'>
              <div className='text-sm font-medium text-muted-foreground'>创建时间</div>
              <div className='text-base'>
                {new Date(project.createdAt).toLocaleString('zh-CN')}
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-sm font-medium text-muted-foreground'>开始日期</div>
              <div className='text-base'>
                {project.startDate
                  ? new Date(project.startDate).toLocaleDateString('zh-CN')
                  : '-'}
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-sm font-medium text-muted-foreground'>结束日期</div>
              <div className='text-base'>
                {project.endDate
                  ? new Date(project.endDate).toLocaleDateString('zh-CN')
                  : '-'}
              </div>
            </div>
            <div className='space-y-2 md:col-span-2'>
              <div className='text-sm font-medium text-muted-foreground'>项目描述</div>
              <div className='text-base whitespace-pre-wrap'>
                {project.description || '-'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue='members' className='w-full'>
        <TabsList className='grid w-full md:w-[400px] grid-cols-2'>
          <TabsTrigger value='members'>成员管理</TabsTrigger>
          <TabsTrigger value='literature'>关联文献</TabsTrigger>
        </TabsList>
        <TabsContent value='members' className='mt-6'>
          <MemberManager projectId={projectId} />
        </TabsContent>
        <TabsContent value='literature' className='mt-6'>
          <ProjectLiterature projectId={projectId} />
        </TabsContent>
      </Tabs>

      {project && (
        <EditProjectDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          currentProject={project}
        />
      )}
    </div>
  )
}
