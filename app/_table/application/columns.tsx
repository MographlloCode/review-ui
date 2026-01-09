// app/_table/application/columns.tsx
'use client'

import { ColumnDef, FilterFn, Row } from '@tanstack/react-table'
import { Application } from '@/types/application'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import React from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'

const assemblyDataOwnerCell = (row: Row<Application>) => {
  const owners = row.original.dataOwners || []

  const firstOwner = owners[0]
  const remainingCount = owners.length - 1

  if (!firstOwner) return <span className='text-gray-400'>-</span>

  return (
    <div className='flex items-center gap-2'>
      <span className='font-medium truncate max-w-full' title={firstOwner}>
        {firstOwner}
      </span>

      {remainingCount > 0 && (
        <span
          className='text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap cursor-help'
          title={owners.slice(1).join('\n')}
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
  return rowValue.toString() === filterValue.toString()
}

const formatUSDateTime = (dateString: string, includeTime: boolean = false) => {
  if (!dateString) return '-'

  const date = new Date(dateString)

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  }).format(date)
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
    size: 60,
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
      <span className='font-medium text-gray-700'>
        {formatUSDateTime(row.original.lastScanDate, true)}
      </span>
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
          <span className='font-medium'>{assemblyDataOwnerCell(row)}</span>
          <div className='flex gap-1'>
            <Button>
              <Icon
                icon={LuPencil}
                size={14}
                className='text-gray-400 hover:text-blue-600 transition-all ease-in-out duration-100'
              />
            </Button>
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
