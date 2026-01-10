'use client'

import { Table } from '@tanstack/react-table'
import {
  LuChevronDown,
  LuEllipsisVertical,
  LuFilter,
  LuSearch,
} from 'react-icons/lu'
import { Button } from '../../Button'
import { Icon } from '../../Icon'
import { BiCheckCircle, BiXCircle } from 'react-icons/bi'
import { PiBroom } from 'react-icons/pi'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

interface TableContainerToolbarProps<TData> {
  table: Table<TData>
  globalFilter: string
  setGlobalFilter: (value: string) => void
}

export function TableContainerToolbar<TData>({
  globalFilter,
  setGlobalFilter,
}: TableContainerToolbarProps<TData>) {
  const [actionsState, setActionsState] = useState(false)
  const [globalFiltersOpen, setGlobalFiltersOpen] = useState(false)
  const containerRefActions = useRef<HTMLDivElement>(null)
  const containerRefFilters = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRefActions.current &&
        !containerRefActions.current.contains(event.target as Node)
      ) {
        setGlobalFiltersOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRefFilters.current &&
        !containerRefFilters.current.contains(event.target as Node)
      ) {
        setGlobalFiltersOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='flex justify-between items-end shrink-0 gap-4'>
      <div className='relative group' ref={containerRefActions}>
        <Button
          className='flex items-center gap-1 text-xs text-gray-600 border border-gray-200 hover:bg-gray-100 p-2 group-hover:text-gray-900 rounded-md transition-all ease-in-out duration-75'
          onClick={() => setActionsState(!actionsState)}
        >
          <LuEllipsisVertical
            className='text-gray-500 group-hover:text-gray-900 transition-all ease-in-out duration-75'
            size={16}
          />
        </Button>
        <AnimatePresence>
          {actionsState && (
            <motion.div
              key={'actions-dropdown'}
              className='absolute flex flex-col gap-2 top-10 left-0 z-30 max-w-96 min-w-72 bg-gray-100 shadow-lg p-3 rounded-lg'
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <div className='flex flex-col'>
                <h1 className='text-xs text-gray-400 uppercase font-semibold mb-1'>
                  Bulk Actions
                </h1>
                <Button className='flex items-center gap-1 text-sm capitalize p-2 hover:bg-gray-200 rounded-md transition-all ease-in-out duration-200'>
                  <Icon
                    icon={BiCheckCircle}
                    className='text-gray-500'
                    size={18}
                  />
                  <span className='leading-2 text-gray-700 font-medium'>
                    Bulk Accept
                  </span>
                </Button>
                <Button className='flex items-center gap-1 text-sm capitalize p-2 hover:bg-gray-200 rounded-md transition-all ease-in-out duration-200'>
                  <Icon icon={BiXCircle} className='text-gray-500' size={18} />
                  <span className='leading-2 text-gray-700 font-medium'>
                    Bulk Reject
                  </span>
                </Button>
              </div>
              <div className='flex flex-col'>
                <h1 className='text-xs text-gray-400 uppercase font-semibold mb-1'>
                  Table Actions
                </h1>
                <Button className='flex items-center gap-1 text-sm capitalize p-2 hover:bg-gray-200 rounded-md transition-all ease-in-out duration-200'>
                  <Icon icon={PiBroom} className='text-gray-500' size={18} />
                  <span className='leading-2 text-gray-700 font-medium'>
                    Clear Filters
                  </span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className='flex items-center gap-2 max-w-96 h-9'>
        <div className='relative max-w-72 w-full'>
          <LuSearch className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder='Search all columns...'
            className='pr-9 pl-3 h-9 w-full rounded-md border border-gray-200 hover:bg-gray-100 p-2 group-hover:text-gray-900 ease-in-out duration-75 text-sm 
                      placeholder:text-gray-400 focus:outline-none focus:ring-1 
                      focus:ring-blue-300 focus:border-transparent transition-all'
          />
        </div>
        <div className='relative group h-full' ref={containerRefFilters}>
          <Button
            className='flex items-center justify-center gap-1 text-xs text-gray-600 border border-gray-200 hover:bg-gray-100 p-2 group-hover:text-gray-900 rounded-md transition-all ease-in-out duration-75 h-full w-9'
            onClick={() => setGlobalFiltersOpen(!globalFiltersOpen)}
          >
            <LuFilter
              className='text-gray-500 group-hover:text-gray-900 transition-all ease-in-out duration-75'
              size={14}
            />
          </Button>
          <AnimatePresence>
            {globalFiltersOpen && (
              <motion.div
                key={'actions-dropdown'}
                className='absolute flex flex-col gap-2 top-10 right-0 z-30 max-w-96 min-w-72 bg-gray-100 shadow-lg p-3 rounded-lg'
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <div className='flex flex-col'>
                  <h1 className='text-xs text-gray-400 uppercase font-semibold mb-1'>
                    Bulk Actions
                  </h1>
                  <Button className='flex items-center gap-1 text-sm capitalize p-2 hover:bg-gray-200 rounded-md transition-all ease-in-out duration-200'>
                    <Icon
                      icon={BiCheckCircle}
                      className='text-gray-500'
                      size={18}
                    />
                    <span className='leading-2 text-gray-700 font-medium'>
                      Bulk Accept
                    </span>
                  </Button>
                  <Button className='flex items-center gap-1 text-sm capitalize p-2 hover:bg-gray-200 rounded-md transition-all ease-in-out duration-200'>
                    <Icon
                      icon={BiXCircle}
                      className='text-gray-500'
                      size={18}
                    />
                    <span className='leading-2 text-gray-700 font-medium'>
                      Bulk Reject
                    </span>
                  </Button>
                </div>
                <div className='flex flex-col'>
                  <h1 className='text-xs text-gray-400 uppercase font-semibold mb-1'>
                    Table Actions
                  </h1>
                  <Button className='flex items-center gap-1 text-sm capitalize p-2 hover:bg-gray-200 rounded-md transition-all ease-in-out duration-200'>
                    <Icon icon={PiBroom} className='text-gray-500' size={18} />
                    <span className='leading-2 text-gray-700 font-medium'>
                      Clear Filters
                    </span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
