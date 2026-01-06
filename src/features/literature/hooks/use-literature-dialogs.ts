import { useState, useCallback } from 'react'
import type { Literature } from '../data/schema'

/**
 * 对话框类型
 */
export type LiteratureDialogType = 'create' | 'edit' | 'delete' | 'view'

/**
 * 对话框状态管理返回值
 */
export type UseLiteratureDialogsReturn = {
  /** 创建对话框打开状态 */
  createOpen: boolean
  /** 编辑对话框打开状态 */
  editOpen: boolean
  /** 删除对话框打开状态 */
  deleteOpen: boolean
  /** 查看对话框打开状态 */
  viewOpen: boolean
  /** 当前选中的文献 */
  selectedLiterature: Literature | null
  /** 打开创建对话框 */
  openCreate: () => void
  /** 打开编辑对话框 */
  openEdit: (literature: Literature) => void
  /** 打开删除对话框 */
  openDelete: (literature: Literature) => void
  /** 打开查看对话框 */
  openView: (literature: Literature) => void
  /** 关闭创建对话框 */
  closeCreate: () => void
  /** 关闭编辑对话框 */
  closeEdit: () => void
  /** 关闭删除对话框 */
  closeDelete: () => void
  /** 关闭查看对话框 */
  closeView: () => void
  /** 设置创建对话框打开状态 */
  setCreateOpen: (open: boolean) => void
  /** 设置编辑对话框打开状态 */
  setEditOpen: (open: boolean) => void
  /** 设置删除对话框打开状态 */
  setDeleteOpen: (open: boolean) => void
  /** 设置查看对话框打开状态 */
  setViewOpen: (open: boolean) => void
}

/**
 * 文献对话框状态管理 Hook
 *
 * 统一管理文献相关的对话框状态（创建、编辑、删除、查看）
 *
 * @returns 对话框状态和操作方法
 *
 * @example
 * ```tsx
 * const {
 *   createOpen,
 *   openCreate,
 *   closeCreate,
 *   openEdit,
 *   selectedLiterature,
 * } = useLiteratureDialogs()
 *
 * return (
 *   <>
 *     <Button onClick={openCreate}>新建</Button>
 *     <Button onClick={() => openEdit(literature)}>编辑</Button>
 *     <LiteratureCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
 *   </>
 * )
 * ```
 *
 * @author ziye
 */
export function useLiteratureDialogs(): UseLiteratureDialogsReturn {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedLiterature, setSelectedLiterature] =
    useState<Literature | null>(null)

  /**
   * 打开创建对话框
   */
  const openCreate = useCallback(() => {
    setSelectedLiterature(null)
    setCreateOpen(true)
  }, [])

  /**
   * 打开编辑对话框
   */
  const openEdit = useCallback((literature: Literature) => {
    setSelectedLiterature(literature)
    setEditOpen(true)
  }, [])

  /**
   * 打开删除对话框
   */
  const openDelete = useCallback((literature: Literature) => {
    setSelectedLiterature(literature)
    setDeleteOpen(true)
  }, [])

  /**
   * 打开查看对话框
   */
  const openView = useCallback((literature: Literature) => {
    setSelectedLiterature(literature)
    setViewOpen(true)
  }, [])

  /**
   * 关闭创建对话框
   */
  const closeCreate = useCallback(() => {
    setCreateOpen(false)
    setTimeout(() => setSelectedLiterature(null), 300)
  }, [])

  /**
   * 关闭编辑对话框
   */
  const closeEdit = useCallback(() => {
    setEditOpen(false)
    setTimeout(() => setSelectedLiterature(null), 300)
  }, [])

  /**
   * 关闭删除对话框
   */
  const closeDelete = useCallback(() => {
    setDeleteOpen(false)
    setTimeout(() => setSelectedLiterature(null), 300)
  }, [])

  /**
   * 关闭查看对话框
   */
  const closeView = useCallback(() => {
    setViewOpen(false)
    setTimeout(() => setSelectedLiterature(null), 300)
  }, [])

  return {
    createOpen,
    editOpen,
    deleteOpen,
    viewOpen,
    selectedLiterature,
    openCreate,
    openEdit,
    openDelete,
    openView,
    closeCreate,
    closeEdit,
    closeDelete,
    closeView,
    setCreateOpen,
    setEditOpen,
    setDeleteOpen,
    setViewOpen,
  }
}
