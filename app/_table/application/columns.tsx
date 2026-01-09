// app/_table/application/columns.tsx
'use client'

import { ColumnDef, Row } from '@tanstack/react-table'
import { Application } from '@/types/application'
import { LuPencil, LuTrash2 } from 'react-icons/lu'

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

export const applicationColumns: ColumnDef<Application>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 150,
  },
  {
    accessorKey: 'application',
    header: 'Application',
    size: 120,
    cell: ({ row }) => (
      <span className='font-medium'>{row.original.application}</span>
    ),
  },
  {
    accessorKey: 'datasource',
    header: 'Datasource',
    size: 150,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 150,
    cell: ({ row }) => (
      <span className='font-medium'>{row.original.datasource}</span>
    ),
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
    header: 'Data Owners',
    size: 150,
    cell: ({ row }) => {
      return (
        <div className='flex gap-2'>
          <span className='font-medium'>{assemblyDataOwnerCell(row)}</span>
          <button className='text-blue-600 hover:bg-blue-50 p-1 rounded'>
            <LuPencil size={16} />
          </button>
          <button className='text-red-600 hover:bg-red-50 p-1 rounded'>
            <LuTrash2 size={16} />
          </button>
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
  },
  {
    accessorKey: 'haveChangeRequest',
    header: 'Have Change Request',
    size: 150,
    cell: ({ row }) => (
      <span className='font-medium'>{row.original.haveChangeRequest}</span>
    ),
  },
]
