import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProjectDialogsProvider } from './components/project-provider'
import { ProjectTable } from './components/project-table'
import type { Project } from './data/schema'

const mockProjects: Project[] = [
  {
    id: 1,
    name: '科研数据管理系统开发',
    description: '开发一个综合性的科研数据管理系统，支持文献管理、项目管理等功能',
    status: 1,
    statusDescription: '进行中',
    ownerId: 1,
    ownerName: 'admin',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: 2,
    name: '深度学习模型训练',
    description: '训练用于图像识别的深度学习模型',
    status: 2,
    statusDescription: '已完成',
    ownerId: 2,
    ownerName: 'user1',
    startDate: '2023-09-01',
    endDate: '2023-12-31',
    createdAt: '2023-09-01T09:00:00Z',
    updatedAt: '2023-12-31T18:00:00Z',
  },
  {
    id: 3,
    name: '自然语言处理研究',
    description: '研究基于Transformer的自然语言处理技术',
    status: 0,
    statusDescription: '已归档',
    ownerId: 1,
    ownerName: 'admin',
    startDate: '2023-03-01',
    endDate: '2023-08-31',
    createdAt: '2023-03-01T08:00:00Z',
    updatedAt: '2023-08-31T17:00:00Z',
  },
]

/**
 * 项目管理页面
 *
 * @description 项目列表主页面，包含搜索、筛选和表格展示功能
 */
export default function ProjectsPage() {
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
        </div>
        <ProjectTable data={mockProjects} />
      </Main>
    </>
  )
}
