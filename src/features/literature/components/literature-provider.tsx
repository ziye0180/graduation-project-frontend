import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Literature } from '../data/schema'

type LiteratureDialogType = 'view' | 'edit' | 'delete'

type LiteratureContextType = {
  open: LiteratureDialogType | null
  setOpen: (str: LiteratureDialogType | null) => void
  currentRow: Literature | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Literature | null>>
}

const LiteratureContext = React.createContext<LiteratureContextType | null>(
  null
)

/**
 * 文献功能的上下文提供器
 *
 * @description 提供文献列表的对话框状态管理和当前选中行数据
 */
export function LiteratureProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<LiteratureDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Literature | null>(null)

  return (
    <LiteratureContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LiteratureContext>
  )
}

/**
 * 获取文献上下文的 Hook
 *
 * @throws {Error} 如果在 LiteratureProvider 外部使用
 * @returns 文献上下文对象
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useLiterature = () => {
  const literatureContext = React.useContext(LiteratureContext)

  if (!literatureContext) {
    throw new Error('useLiterature has to be used within <LiteratureContext>')
  }

  return literatureContext
}
