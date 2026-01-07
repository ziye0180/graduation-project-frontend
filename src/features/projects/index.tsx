import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'
import { ProjectDialogsProvider } from './components/project-provider'
import { ProjectTable } from './components/project-table'
import {
  ProjectCreateDialog,
  ProjectDeleteDialog,
  ProjectEditDialog,
  ProjectViewDialog,
} from './components/project-dialogs'
import { useProjectList } from './hooks/use-project'
import { useProjectDialogs } from './hooks/use-project-dialogs'

/**
 * 项目管理页面
 *
 * @description 项目列表主页面，包含搜索、筛选和表格展示功能
 */
export default function ProjectsPage() {
  const { data, isLoading } = useProjectList({
    page: 1,
    size: 20,
  })

  const {
    createOpen,
    editOpen,
    deleteOpen,
    viewOpen,
    selectedProject,
    openCreate,
    setCreateOpen,
    setEditOpen,
    setDeleteOpen,
    setViewOpen,
  } = useProjectDialogs()

  return (
    <>
      <ProjectDialogsProvider />
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>项目管理</h2>
            <p className='text-muted-foreground'>管理和浏览项目资源</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className='mr-2 h-4 w-4' />
            新建项目
          </Button>
        </div>

        {isLoading ? (
          <div className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-[400px] w-full' />
          </div>
        ) : (
          <ProjectTable data={data?.records || []} />
        )}
      </Main>

      {/* 对话框 */}
      <ProjectCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ProjectEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        currentProject={selectedProject}
      />
      <ProjectDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        currentProject={selectedProject}
      />
      <ProjectViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        currentProject={selectedProject}
      />
    </>
  )
}
