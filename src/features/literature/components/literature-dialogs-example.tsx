/**
 * 文献对话框组件使用示例
 *
 * 本文件演示如何使用文献管理的各种对话框组件
 *
 * @author ziye
 */

import { Button } from '@/components/ui/button'
import {
  LiteratureCreateDialog,
  LiteratureEditDialog,
  LiteratureDeleteDialog,
  LiteratureViewDialog,
} from './literature-dialogs'
import { useLiteratureDialogs } from '../hooks/use-literature-dialogs'
import { useCategoryTree } from '../hooks/use-literature'

/**
 * 文献对话框示例组件
 *
 * 展示如何集成和使用文献管理的所有对话框
 *
 * @example
 * ```tsx
 * // 在页面中使用
 * import { LiteratureDialogsExample } from '@/features/literature/components/literature-dialogs-example'
 *
 * function LiteraturePage() {
 *   return (
 *     <div>
 *       <LiteratureDialogsExample />
 *     </div>
 *   )
 * }
 * ```
 */
export function LiteratureDialogsExample() {
  const {
    createOpen,
    editOpen,
    deleteOpen,
    viewOpen,
    selectedLiterature,
    openCreate,
    openEdit,
    openDelete,
    openView,
    setCreateOpen,
    setEditOpen,
    setDeleteOpen,
    setViewOpen,
  } = useLiteratureDialogs()

  const { data: categories = [] } = useCategoryTree()

  // 模拟文献数据
  const mockLiterature = {
    id: 1,
    title: '深度学习在自然语言处理中的应用研究',
    authors: '张三, 李四, 王五',
    abstractText:
      '本文系统性地综述了深度学习技术在自然语言处理领域的最新应用进展，包括词向量表示、序列建模、注意力机制等关键技术。',
    keywords: '深度学习, 自然语言处理, 神经网络',
    doi: '10.1000/xyz123',
    publishYear: 2024,
    journal: '计算机学报',
    categoryId: 1,
    categoryName: '人工智能',
    fileUrl: 'https://example.com/papers/deep-learning-nlp.pdf',
    fileSize: 2048,
    uploaderId: 1,
    uploaderName: '张三',
    status: 1,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-02T00:00:00',
  }

  return (
    <div className='space-y-4 p-6'>
      <h2 className='text-2xl font-bold'>文献对话框使用示例</h2>

      <div className='flex gap-4'>
        <Button onClick={openCreate}>新建文献</Button>
        <Button onClick={() => openEdit(mockLiterature)}>编辑文献</Button>
        <Button onClick={() => openDelete(mockLiterature)} variant='destructive'>
          删除文献
        </Button>
        <Button onClick={() => openView(mockLiterature)} variant='outline'>
          查看详情
        </Button>
      </div>

      {/* 创建对话框 */}
      <LiteratureCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        categories={categories}
      />

      {/* 编辑对话框 */}
      {selectedLiterature && (
        <LiteratureEditDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          currentLiterature={selectedLiterature}
          categories={categories}
        />
      )}

      {/* 删除对话框 */}
      {selectedLiterature && (
        <LiteratureDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          currentLiterature={selectedLiterature}
        />
      )}

      {/* 查看对话框 */}
      {selectedLiterature && (
        <LiteratureViewDialog
          open={viewOpen}
          onOpenChange={setViewOpen}
          currentLiterature={selectedLiterature}
        />
      )}
    </div>
  )
}
