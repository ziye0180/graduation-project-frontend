'use client'

import {
  CreateProjectDialog,
  EditProjectDialog,
  DeleteProjectDialog,
  ViewProjectDialog,
} from './project-dialogs'
import { useProjectDialogs } from '../hooks/use-project-dialogs'

/**
 * 项目对话框统一提供器
 *
 * 统一挂载所有项目相关对话框，简化对话框的管理和使用
 *
 * @returns 项目对话框提供器组件
 *
 * @example
 * ```tsx
 * // 在页面或布局中使用
 * export default function ProjectsPage() {
 *   const { openCreate, openEdit, openDelete, openView } = useProjectDialogs()
 *
 *   return (
 *     <>
 *       <ProjectDialogsProvider />
 *       <Button onClick={openCreate}>新建项目</Button>
 *     </>
 *   )
 * }
 * ```
 *
 * @author ziye
 */
export function ProjectDialogsProvider() {
  const {
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    viewOpen,
    setViewOpen,
    selectedProject,
  } = useProjectDialogs()

  return (
    <>
      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
      {selectedProject && (
        <>
          <EditProjectDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            currentProject={selectedProject}
          />
          <DeleteProjectDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            currentProject={selectedProject}
          />
          <ViewProjectDialog
            open={viewOpen}
            onOpenChange={setViewOpen}
            currentProject={selectedProject}
          />
        </>
      )}
    </>
  )
}
