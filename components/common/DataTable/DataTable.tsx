'use client'

import { ColumnDef } from '@tanstack/react-table'

import { useDataTable } from './hooks/useDataTable'

import { TableContainerToolbar } from './components/TableContainerToolbar'
import { TableHeader } from './components/TableHeader/TableHeader'
import { TableBody } from './components/TableBody'
import { TableFooter } from './components/TableFooter/TableFooter'
import { TableFooterActions } from './components/TableFooter/TableFooterActions'

interface DataTableProps<TData extends { id: string | number }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  rowCount: number
  estimateRowHeight?: number
  className?: string
}

export function DataTable<TData extends { id: string | number }, TValue>({
  columns,
  data,
  pageCount,
  rowCount,
  estimateRowHeight = 50,
  className = '',
}: DataTableProps<TData, TValue>) {
  const { table, globalFilter, setGlobalFilter } = useDataTable({
    columns,
    data,
    pageCount,
  })

  return (
    <div className={`flex flex-col gap-4 w-full h-full ${className}`}>
      <TableContainerToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      <div className='relative flex-1 overflow-auto border rounded-t-md bg-white shadow-sm'>
        <table className='min-w-full w-fit grid'>
          <TableHeader table={table} />
          <TableBody table={table} estimateRowHeight={estimateRowHeight} />
        </table>
      </div>

      <TableFooter table={table} rowCount={rowCount}>
        <TableFooterActions table={table} />
      </TableFooter>
    </div>
  )
}
