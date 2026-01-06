import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { LiteratureProvider } from './components/literature-provider'
import { LiteratureTable } from './components/literature-table'

// 模拟数据，实际应从 API 获取
const mockLiteratures = [
  {
    id: 1,
    title: '深度学习在自然语言处理中的应用研究',
    authors: '张三, 李四, 王五',
    abstractText: '本文探讨了深度学习技术在自然语言处理领域的最新应用...',
    keywords: '深度学习, 自然语言处理, 神经网络',
    doi: '10.1234/example.2023.001',
    publishYear: 2023,
    journal: '计算机研究与发展',
    categoryId: 1,
    categoryName: '人工智能',
    fileUrl: '/files/literature_1.pdf',
    fileSize: 2048576,
    uploaderId: 1,
    uploaderName: 'admin',
    status: 1,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    title: '基于机器学习的图像识别算法优化',
    authors: '赵六, 孙七',
    abstractText: '提出了一种新的图像识别算法优化方法...',
    keywords: '机器学习, 图像识别, 算法优化',
    doi: '10.1234/example.2023.002',
    publishYear: 2023,
    journal: 'IEEE Transactions on Pattern Analysis',
    categoryId: 1,
    categoryName: '人工智能',
    fileUrl: '/files/literature_2.pdf',
    fileSize: 3145728,
    uploaderId: 2,
    uploaderName: 'user1',
    status: 1,
    createdAt: '2024-02-20T14:20:00Z',
    updatedAt: '2024-02-20T14:20:00Z',
  },
]

/**
 * 文献管理页面
 *
 * @description 文献列表主页面，包含搜索、筛选和表格展示功能
 */
export function Literature() {
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
        </div>
        <LiteratureTable data={mockLiteratures} />
      </Main>
    </LiteratureProvider>
  )
}
