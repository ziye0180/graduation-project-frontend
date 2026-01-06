import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Project } from '@/types/project'
import { DataTableRowActions } from './data-table-row-actions'

/**
 * 获取项目状态的颜色标签
 *
 * @param status - 项目状态值
 * @returns 带颜色的状态标签组件
 */
const getStatusBadge = (status: number, statusDescription: string) => {
  const statusConfig: Record<
    number,
    { variant: 'default' | 'secondary' | 'outline'; label: string }
  > = {
    1: { variant: 'default', label: statusDescription || '进行中' },
    2: { variant: 'secondary', label: statusDescription || '已完成' },
    3: { variant: 'outline', label: statusDescription || '已归档' },
  }

  const config = statusConfig[status] || {
    variant: 'outline' as const,
    label: statusDescription || '未知',
  }

  return <Badge variant={config.variant}>{config.label}</Badge>
}

/**
 * 项目表格列定义
 *
 * @description 定义项目列表表格的所有列，包括项目名称、状态、负责人、日期等信息
 */
export const projectColumns: ColumnDef<Project>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='全选'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='选择行'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='项目名称' />
    ),
    meta: {
      className: 'ps-1 max-w-0 w-1/3',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => (
      <LongText className='max-w-xs font-medium'>
        {row.getValue('name')}
      </LongText>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='状态' />
    ),
    meta: {
      className: 'ps-1',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as number
      const statusDescription = row.original.statusDescription
      return (
        <div className='w-[100px]'>{getStatusBadge(status, statusDescription)}</div>
      )
    },
  },
  {
    accessorKey: 'ownerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='负责人' />
    ),
    meta: {
      className: 'ps-1',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => (
      <div className='w-[100px]'>{row.getValue('ownerName') || '-'}</div>
    ),
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='开始日期' />
    ),
    meta: {
      className: 'ps-1',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => {
      const startDate = row.getValue('startDate') as string | null
      if (!startDate) return <div className='w-[120px]'>-</div>
      const date = new Date(startDate)
      return <div className='w-[120px]'>{date.toLocaleDateString('zh-CN')}</div>
    },
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='结束日期' />
    ),
    meta: {
      className: 'ps-1',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => {
      const endDate = row.getValue('endDate') as string | null
      if (!endDate) return <div className='w-[120px]'>-</div>
      const date = new Date(endDate)
      return <div className='w-[120px]'>{date.toLocaleDateString('zh-CN')}</div>
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='创建时间' />
    ),
    meta: {
      className: 'ps-1',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return <div className='w-[150px]'>{date.toLocaleString('zh-CN')}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
