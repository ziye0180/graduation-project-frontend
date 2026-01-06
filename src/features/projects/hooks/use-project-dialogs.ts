import { useState, useCallback } from 'react'
import type { Project } from '@/types/project'

/**
 * 对话框类型
 */
export type ProjectDialogType = 'create' | 'edit' | 'delete' | 'view'

/**
 * 对话框状态管理返回值
 */
export type UseProjectDialogsReturn = {
  /** 创建对话框打开状态 */
  createOpen: boolean
  /** 编辑对话框打开状态 */
  editOpen: boolean
  /** 删除对话框打开状态 */
  deleteOpen: boolean
  /** 查看对话框打开状态 */
  viewOpen: boolean
  /** 当前选中的项目 */
  selectedProject: Project | null
  /** 打开创建对话框 */
  openCreate: () => void
  /** 打开编辑对话框 */
  openEdit: (project: Project) => void
  /** 打开删除对话框 */
  openDelete: (project: Project) => void
  /** 打开查看对话框 */
  openView: (project: Project) => void
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
 * 项目对话框状态管理 Hook
 *
 * 统一管理项目相关的对话框状态（创建、编辑、删除、查看）
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
 *   selectedProject,
 * } = useProjectDialogs()
 *
 * return (
 *   <>
 *     <Button onClick={openCreate}>新建</Button>
 *     <Button onClick={() => openEdit(project)}>编辑</Button>
 *     <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
 *   </>
 * )
 * ```
 *
 * @author ziye
 */
export function useProjectDialogs(): UseProjectDialogsReturn {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  /**
   * 打开创建对话框
   */
  const openCreate = useCallback(() => {
    setSelectedProject(null)
    setCreateOpen(true)
  }, [])

  /**
   * 打开编辑对话框
   */
  const openEdit = useCallback((project: Project) => {
    setSelectedProject(project)
    setEditOpen(true)
  }, [])

  /**
   * 打开删除对话框
   */
  const openDelete = useCallback((project: Project) => {
    setSelectedProject(project)
    setDeleteOpen(true)
  }, [])

  /**
   * 打开查看对话框
   */
  const openView = useCallback((project: Project) => {
    setSelectedProject(project)
    setViewOpen(true)
  }, [])

  /**
   * 关闭创建对话框
   */
  const closeCreate = useCallback(() => {
    setCreateOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }, [])

  /**
   * 关闭编辑对话框
   */
  const closeEdit = useCallback(() => {
    setEditOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }, [])

  /**
   * 关闭删除对话框
   */
  const closeDelete = useCallback(() => {
    setDeleteOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }, [])

  /**
   * 关闭查看对话框
   */
  const closeView = useCallback(() => {
    setViewOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }, [])

  return {
    createOpen,
    editOpen,
    deleteOpen,
    viewOpen,
    selectedProject,
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
