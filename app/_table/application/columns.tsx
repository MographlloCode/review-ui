// app/_table/application/columns.tsx
'use client'

import { ColumnDef, FilterFn, Row } from '@tanstack/react-table'
import { Application } from '@/types/application'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import React from 'react'

const assemblyDataOwnerCell = (row: Row<Application>) => {
  const owners = row.original.dataOwners || []

  // 2. Separa o primeiro e conta o resto
  const firstOwner = owners[0]
  const remainingCount = owners.length - 1

  // Se não tiver ninguém
  if (!firstOwner) return <span className='text-gray-400'>-</span>

  return (
    <div className='flex items-center gap-2'>
      {/* O Primeiro Dono (com truncate para não quebrar layout) */}
      <span
        className='font-medium truncate max-w-37.5'
        title={firstOwner} // Tooltip nativo mostra o email completo ao passar o mouse
      >
        {firstOwner}
      </span>

      {/* A Tag "+X Owners" (só aparece se tiver mais de 1) */}
      {remainingCount > 0 && (
        <span
          className='text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap cursor-help'
          title={owners.slice(1).join('\n')} // Tooltip mostra a lista dos ocultos
        >
          +{remainingCount}
        </span>
      )}
    </div>
  )
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & React.HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate, rest.checked])

  return (
    <input
      type='checkbox'
      ref={ref}
      className={
        className +
        ' cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500'
      }
      {...rest}
    />
  )
}

const numberEqualsFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  const rowValue: number = row.getValue(columnId)
  // Ensure both are treated as strings for simple comparison, or handle number comparison explicitly
  return rowValue.toString() === filterValue.toString()
}

export const applicationColumns: ColumnDef<Application>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='px-1'>
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='px-1'>
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
    size: 40,
  },
  {
    accessorKey: 'application',
    header: 'Application',
    size: 225,
    cell: ({ row }) => (
      <span className='font-medium'>{row.original.application}</span>
    ),
  },
  {
    accessorKey: 'datasource',
    header: 'Datasource',
    size: 225,
  },
  {
    accessorKey: 'lastScanDate',
    header: 'Last Scan Date',
    size: 150,
    cell: ({ row }) => (
      <span className='font-medium'>{row.original.lastScanDate}</span>
    ),
  },
  {
    id: 'dataOwners',
    accessorFn: (row) => row.dataOwners?.join(' ') || '',
    header: 'Data Owners',
    size: 250, // Aumentei um pouco pois nomes/emails costumam ser longos
    cell: ({ row }) => {
      return (
        <div className='flex gap-2 w-full justify-between items-center'>
          {' '}
          {/* Melhorei o layout interno */}
          <span className='font-medium'>{assemblyDataOwnerCell(row)}</span>
          {/* Botões alinhados à direita */}
          <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
            <button className='text-blue-600 hover:bg-blue-50 p-1 rounded'>
              <LuPencil size={16} />
            </button>
            <button className='text-red-600 hover:bg-red-50 p-1 rounded'>
              <LuTrash2 size={16} />
            </button>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'curationRate',
    header: 'Curation Rate',
    size: 150,
    cell: ({ row }) => (
      <span className='font-medium'>{row.original.curationRate}%</span>
    ),
    filterFn: numberEqualsFilterFn,
  },
  {
    accessorKey: 'haveChangeRequest',
    header: 'Have Change Request',
    size: 200,
    cell: ({ row }) => (
      <span className='font-medium'>{row.original.haveChangeRequest}</span>
    ),
  },
]
