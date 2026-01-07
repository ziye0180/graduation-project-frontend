import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'
import { LiteratureProvider } from './components/literature-provider'
import { LiteratureTable } from './components/literature-table'
import {
  LiteratureCreateDialog,
  LiteratureDeleteDialog,
  LiteratureEditDialog,
  LiteratureViewDialog,
} from './components/literature-dialogs'
import { useLiteratureList } from './hooks/use-literature'
import { useLiteratureDialogs } from './hooks/use-literature-dialogs'

/**
 * 文献管理页面
 *
 * @description 文献列表主页面，包含搜索、筛选和表格展示功能
 */
export function Literature() {
  const { data, isLoading } = useLiteratureList({
    pageNum: 1,
    pageSize: 20,
  })

  const {
    createOpen,
    editOpen,
    deleteOpen,
    viewOpen,
    selectedLiterature,
    openCreate,
    setCreateOpen,
    setEditOpen,
    setDeleteOpen,
    setViewOpen,
  } = useLiteratureDialogs()

  return (
    <LiteratureProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>文献管理</h2>
            <p className='text-muted-foreground'>
              管理和浏览文献资源
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className='mr-2 h-4 w-4' />
            新建文献
          </Button>
        </div>

        {isLoading ? (
          <div className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-[400px] w-full' />
          </div>
        ) : (
          <LiteratureTable data={data?.records || []} />
        )}
      </Main>

      {/* 对话框 */}
      <LiteratureCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
      <LiteratureEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        currentLiterature={selectedLiterature}
      />
      <LiteratureDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        currentLiterature={selectedLiterature}
      />
      <LiteratureViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        currentLiterature={selectedLiterature}
      />
    </LiteratureProvider>
  )
}
