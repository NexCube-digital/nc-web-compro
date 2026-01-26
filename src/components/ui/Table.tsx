import React, { ReactNode } from 'react'

interface TableProps {
  children: ReactNode
  striped?: boolean
  hover?: boolean
  responsive?: boolean
  className?: string
}

export const Table: React.FC<TableProps> = ({
  children,
  striped = false,
  hover = false,
  responsive = true,
  className
}) => {
  const responsiveClass = responsive ? 'overflow-x-auto' : ''
  const stripedClass = striped ? '[&_tbody_tr:nth-child(odd)]:bg-slate-50' : ''
  const hoverClass = hover ? '[&_tbody_tr]:hover:bg-slate-100 [&_tbody_tr]:transition-colors' : ''

  return (
    <div className={`${responsiveClass} rounded-lg border border-slate-200`}>
      <table className={`w-full ${stripedClass} ${hoverClass} ${className}`}>
        {children}
      </table>
    </div>
  )
}

interface TableHeadProps {
  children: ReactNode
}

export const TableHead: React.FC<TableHeadProps> = ({ children }) => {
  return (
    <thead className="bg-slate-50 border-b border-slate-200">
      {children}
    </thead>
  )
}

interface TableBodyProps {
  children: ReactNode
}

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return (
    <tbody>
      {children}
    </tbody>
  )
}

interface TableRowProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  onClick,
  className
}) => {
  const clickableClass = onClick ? 'cursor-pointer' : ''

  return (
    <tr
      onClick={onClick}
      className={`border-b border-slate-200 last:border-b-0 ${clickableClass} ${className}`}
    >
      {children}
    </tr>
  )
}

interface TableCellProps {
  children: ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className,
  align = 'left'
}) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <td className={`px-6 py-4 text-sm text-slate-700 ${alignClass[align]} ${className}`}>
      {children}
    </td>
  )
}

interface TableHeaderCellProps {
  children: ReactNode
  className?: string
  sortable?: boolean
  sorted?: 'asc' | 'desc' | null
  onSort?: () => void
}

export const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
  children,
  className,
  sortable = false,
  sorted = null,
  onSort
}) => {
  const clickableClass = sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''

  return (
    <th
      onClick={onSort}
      className={`px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider ${clickableClass} ${className}`}
    >
      <div className="flex items-center gap-2">
        <span>{children}</span>
        {sortable && (
          <svg
            className={`w-4 h-4 transition-transform ${
              sorted === 'asc' ? 'rotate-180' : ''
            } ${sorted ? 'text-blue-600' : 'text-slate-400'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 5.293l-5.293 5.293a1 1 0 101.414 1.414L10 8.12l3.879 3.879a1 1 0 001.414-1.414L10 5.293z" />
          </svg>
        )}
      </div>
    </th>
  )
}

interface DataTableProps<T> {
  columns: Array<{
    key: string
    label: string
    sortable?: boolean
    render?: (value: any, row: T) => ReactNode
  }>
  data: T[]
  onRowClick?: (row: T) => void
  loading?: boolean
  emptyMessage?: string
}

export const DataTable = React.forwardRef<HTMLTableElement, DataTableProps<any>>(
  (
    {
      columns,
      data,
      onRowClick,
      loading = false,
      emptyMessage = 'Tidak ada data'
    },
    ref
  ) => {
    const [sortKey, setSortKey] = React.useState<string | null>(null)
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc')

    const handleSort = (key: string) => {
      if (sortKey === key) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        setSortKey(key)
        setSortOrder('asc')
      }
    }

    const sortedData = React.useMemo(() => {
      if (!sortKey) return data

      return [...data].sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }, [data, sortKey, sortOrder])

    if (loading) {
      return (
        <div className="p-8 text-center">
          <svg className="w-8 h-8 animate-spin mx-auto text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="p-8 text-center">
          <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-slate-600 font-medium">{emptyMessage}</p>
        </div>
      )
    }

    return (
      <Table responsive striped hover>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableHeaderCell
                key={col.key}
                sortable={col.sortable}
                sorted={sortKey === col.key ? sortOrder : null}
                onSort={() => col.sortable && handleSort(col.key)}
              >
                {col.label}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row, idx) => (
            <TableRow
              key={idx}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <TableCell key={`${idx}-${col.key}`}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
)

DataTable.displayName = 'DataTable'
