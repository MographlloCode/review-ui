export const getColumnStyles = (
  columnId: string,
  size: number,
  isCollapsed: boolean,
) => {
  if (columnId === 'select') return { width: size, flex: '0 0 auto' }

  if (isCollapsed) {
    return {
      width: '55px',
      minWidth: '55px',
      flex: '0 0 auto',
      position: 'relative' as const,
      borderRight: '1px solid #e5e7eb',
      borderLeft: '1px solid #e5e7eb',
      overflow: 'visible',
    }
  }

  return {
    minWidth: size,
    flex: 1,
    borderRight: '1px solid #f3f4f6',
  }
}

export const capitalizeFirstLetter = (str: string) => {
  if (str.length === 0) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}
