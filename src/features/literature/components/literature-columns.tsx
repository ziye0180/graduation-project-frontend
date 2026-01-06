import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Literature } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

/**
 * 文献表格列定义
 *
 * @description 定义文献列表表格的所有列，包括标题、作者、期刊等信息
 */
export const literatureColumns: ColumnDef<Literature>[] = [
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
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='标题' />
    ),
    meta: {
      className: 'ps-1 max-w-0 w-1/3',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => (
      <LongText className='max-w-xs font-medium'>
        {row.getValue('title')}
      </LongText>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'authors',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='作者' />
    ),
    meta: {
      className: 'ps-1',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => (
      <LongText className='max-w-36'>
        {row.getValue('authors') || '-'}
      </LongText>
    ),
  },
  {
    accessorKey: 'journal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='期刊' />
    ),
    meta: {
      className: 'ps-1',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => (
      <LongText className='max-w-36'>
        {row.getValue('journal') || '-'}
      </LongText>
    ),
  },
  {
    accessorKey: 'publishYear',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='年份' />
    ),
    meta: {
      className: 'ps-1',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => (
      <div className='w-[60px]'>{row.getValue('publishYear') || '-'}</div>
    ),
  },
  {
    accessorKey: 'categoryName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='分类' />
    ),
    meta: {
      className: 'ps-1',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => (
      <div className='w-[100px]'>{row.getValue('categoryName') || '-'}</div>
    ),
  },
  {
    accessorKey: 'uploaderName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='上传者' />
    ),
    meta: {
      className: 'ps-1',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => (
      <div className='w-[100px]'>{row.getValue('uploaderName') || '-'}</div>
    ),
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
